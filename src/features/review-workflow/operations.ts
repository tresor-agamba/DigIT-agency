import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { canTransitionRequest } from "./policy";

export class ReviewWorkflowError extends Error {}
const activeRequestStatuses=["PENDING","IN_PROGRESS"] as const;

export async function publishVersionForReview(versionId:string){return prisma.$transaction(async tx=>{
  const version=await tx.projectVersion.findUnique({where:{id:versionId},select:{id:true,projectId:true,status:true,project:{select:{status:true}},deliverables:{where:{OR:[{previewKind:"FILE",previewStorageKey:{not:null},previewMimeType:{not:null}},{previewKind:"EXTERNAL_URL",previewUrl:{not:null}}]},select:{id:true},take:1}}});
  if(!version)throw new ReviewWorkflowError("Version introuvable.");
  if(version.status!=="DRAFT")throw new ReviewWorkflowError("Seule une version brouillon peut être publiée.");
  if(version.project.status==="APPROVED")throw new ReviewWorkflowError("Un projet approuvé ne peut pas être rouvert.");
  if(!version.deliverables.length)throw new ReviewWorkflowError("Ajoutez au moins une preview exploitable avant publication.");
  const latest=await tx.projectVersion.findFirst({where:{projectId:version.projectId},orderBy:{versionNumber:"desc"},select:{id:true}});
  if(latest?.id!==version.id)throw new ReviewWorkflowError("Seule la dernière version du projet peut être publiée.");
  if(await tx.projectVersion.findFirst({where:{projectId:version.projectId,status:"READY_FOR_REVIEW",id:{not:version.id}},select:{id:true}}))throw new ReviewWorkflowError("Une autre version attend déjà la décision du Client.");
  const claimed=await tx.projectVersion.updateMany({where:{id:version.id,status:"DRAFT"},data:{status:"READY_FOR_REVIEW"}});
  if(claimed.count!==1)throw new ReviewWorkflowError("Cette version a déjà été modifiée.");
  await tx.project.update({where:{id:version.projectId},data:{status:"REVIEW"}});return{projectId:version.projectId,versionId:version.id};
})}

export async function requestVersionChanges(clientId:string,versionId:string,title:string,description:string){const owned=await prisma.projectVersion.findFirst({where:{id:versionId,project:{clientId}},select:{id:true}});if(!owned)throw new ReviewWorkflowError("Version introuvable.");return prisma.$transaction(async tx=>{
  const claimed=await tx.projectVersion.updateMany({where:{id:versionId,status:"READY_FOR_REVIEW"},data:{status:"CHANGES_REQUESTED"}});
  if(claimed.count!==1)throw new ReviewWorkflowError("Cette version n’accepte pas de demande de modification ou une décision existe déjà.");
  const version=await tx.projectVersion.findUnique({where:{id:versionId},select:{id:true,projectId:true,status:true,approval:{select:{id:true}},project:{select:{clientId:true}},modificationRequests:{where:{status:{in:[...activeRequestStatuses]}},select:{id:true},take:1}}});
  if(!version||version.project.clientId!==clientId)throw new ReviewWorkflowError("Version introuvable.");
  if(version.approval)throw new ReviewWorkflowError("Cette version n’accepte pas de demande de modification.");
  const latest=await tx.projectVersion.findFirst({where:{projectId:version.projectId},orderBy:{versionNumber:"desc"},select:{id:true}});
  if(latest?.id!==version.id)throw new ReviewWorkflowError("Seule la dernière version peut recevoir une décision.");
  if(version.modificationRequests.length)throw new ReviewWorkflowError("Une demande active existe déjà.");
  const request=await tx.modificationRequest.create({data:{versionId:version.id,clientId,title,description},select:{id:true}});
  await tx.project.update({where:{id:version.projectId},data:{status:"CHANGES_REQUESTED"}});return{...request,projectId:version.projectId,versionId:version.id};
})}

export async function approveReviewedVersion(clientId:string,versionId:string){const owned=await prisma.projectVersion.findFirst({where:{id:versionId,project:{clientId}},select:{id:true}});if(!owned)throw new ReviewWorkflowError("Version introuvable.");try{return await prisma.$transaction(async tx=>{
  const claimed=await tx.projectVersion.updateMany({where:{id:versionId,status:"READY_FOR_REVIEW"},data:{status:"APPROVED"}});
  if(claimed.count!==1)throw new ReviewWorkflowError("Cette version ne peut pas être approuvée ou une décision existe déjà.");
  const version=await tx.projectVersion.findUnique({where:{id:versionId},select:{id:true,projectId:true,status:true,approval:{select:{id:true}},project:{select:{clientId:true}},modificationRequests:{where:{status:{in:[...activeRequestStatuses]}},select:{id:true},take:1},deliverables:{where:{OR:[{previewKind:"FILE",previewStorageKey:{not:null}},{previewKind:"EXTERNAL_URL",previewUrl:{not:null}}]},select:{id:true},take:1}}});
  if(!version||version.project.clientId!==clientId)throw new ReviewWorkflowError("Version introuvable.");
  if(version.approval)throw new ReviewWorkflowError("Cette version ne peut pas être approuvée.");
  if(version.modificationRequests.length)throw new ReviewWorkflowError("Une demande de modification active empêche l’approbation.");
  if(!version.deliverables.length)throw new ReviewWorkflowError("Aucune preview publiée n’est disponible.");
  const latest=await tx.projectVersion.findFirst({where:{projectId:version.projectId},orderBy:{versionNumber:"desc"},select:{id:true}});
  if(latest?.id!==version.id)throw new ReviewWorkflowError("Seule la dernière version peut être approuvée.");
  const approval=await tx.versionApproval.create({data:{versionId:version.id,clientId},select:{id:true}});
  await tx.project.update({where:{id:version.projectId},data:{status:"APPROVED"}});return{...approval,projectId:version.projectId,versionId:version.id};
})}catch(error){if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002")throw new ReviewWorkflowError("Cette version a déjà été approuvée.");throw error}}

export async function changeModificationRequest(requestId:string,status:"IN_PROGRESS"|"COMPLETED"|"REJECTED",adminResponse?:string){return prisma.$transaction(async tx=>{
  const request=await tx.modificationRequest.findUnique({where:{id:requestId},select:{id:true,status:true,version:{select:{projectId:true}}}});
  if(!request)throw new ReviewWorkflowError("Demande introuvable.");if(!canTransitionRequest(request.status,status))throw new ReviewWorkflowError("Transition de demande non autorisée.");
  const terminal=status==="COMPLETED"||status==="REJECTED";const updated=await tx.modificationRequest.updateMany({where:{id:request.id,status:request.status},data:{status,adminResponse:adminResponse||null,resolvedAt:terminal?new Date():null}});
  if(updated.count!==1)throw new ReviewWorkflowError("Cette demande a déjà été modifiée.");return{requestId:request.id,projectId:request.version.projectId};
})}

export async function createNextVersionFromRequest(requestId:string){try{return await prisma.$transaction(async tx=>{
  const request=await tx.modificationRequest.findUnique({where:{id:requestId},select:{id:true,title:true,status:true,resolvedVersionId:true,version:{select:{status:true,projectId:true}}}});
  if(!request)throw new ReviewWorkflowError("Demande introuvable.");if(request.resolvedVersionId)throw new ReviewWorkflowError("Une version suivante existe déjà pour cette demande.");
  if(!activeRequestStatuses.includes(request.status as typeof activeRequestStatuses[number])||request.version.status!=="CHANGES_REQUESTED")throw new ReviewWorkflowError("Cette demande n’est pas éligible.");
  const latest=await tx.projectVersion.findFirst({where:{projectId:request.version.projectId},orderBy:{versionNumber:"desc"},select:{versionNumber:true}});const next=(latest?.versionNumber??0)+1;
  const version=await tx.projectVersion.create({data:{projectId:request.version.projectId,versionNumber:next,name:`Version ${next}`,description:`Suite à la demande : ${request.title}`,status:"DRAFT"},select:{id:true,versionNumber:true,projectId:true}});
  const linked=await tx.modificationRequest.updateMany({where:{id:request.id,resolvedVersionId:null},data:{resolvedVersionId:version.id,status:"IN_PROGRESS",resolvedAt:null}});if(linked.count!==1)throw new ReviewWorkflowError("Une version suivante existe déjà pour cette demande.");
  await tx.project.update({where:{id:version.projectId},data:{status:"IN_PROGRESS"}});return{...version,requestId:request.id};
})}catch(error){if(error instanceof Prisma.PrismaClientKnownRequestError&&error.code==="P2002")throw new ReviewWorkflowError("La version suivante a déjà été créée.");throw error}}
