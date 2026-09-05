import type{Prisma}from"@prisma/client";import{prisma}from"@/lib/prisma";import{createNotification}from"@/features/notifications/operations";import{commitStagedFile,finalStorageKey,removePrivateFile,removeTempFile,stagePrivateFile}from"@/lib/storage/private-storage";import{validateFinalFile,validateFinalUrl}from"./validation";
export class FinalDeliveryError extends Error{}
async function context(projectId:string,versionId:string,deliverableId:string){
 const d=await prisma.deliverable.findFirst({where:{id:deliverableId,versionId,version:{projectId}},select:{id:true,type:true,finalKind:true,finalStorageKey:true,updatedAt:true,version:{select:{id:true,status:true,project:{select:{status:true,payments:{where:{type:"FINAL",status:"PAID"},select:{id:true},take:1},versions:{orderBy:{versionNumber:"desc"},select:{id:true},take:1}}}}}}});
 if(!d)throw new FinalDeliveryError("Livrable introuvable pour cette version.");
 if(!["READY_FOR_DELIVERY","DELIVERED"].includes(d.version.project.status))throw new FinalDeliveryError("Le projet n’est pas prêt pour la livraison.");
 if(!d.version.project.payments.length)throw new FinalDeliveryError("Un paiement final validé est requis.");
 if(d.version.project.versions[0]?.id!==d.version.id||!["APPROVED","FINAL"].includes(d.version.status))throw new FinalDeliveryError("Seule la dernière version approuvée peut être livrée.");
 return d;
}
async function lockAndAssertUnchanged(tx:Prisma.TransactionClient,deliverableId:string,snapshot:{finalKind:unknown;finalStorageKey:string|null}){
 await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${deliverableId}))`;
 const current=await tx.deliverable.findUnique({where:{id:deliverableId},select:{finalKind:true,finalStorageKey:true}});
 if(!current||current.finalKind!==snapshot.finalKind||current.finalStorageKey!==snapshot.finalStorageKey)throw new FinalDeliveryError("Le livrable final a été modifié simultanément. Réessayez.");
}
export async function saveFinalFile(actorId:string,projectId:string,versionId:string,deliverableId:string,file:File){
 const d=await context(projectId,versionId,deliverableId),v=validateFinalFile(d.type,file),key=finalStorageKey(projectId,versionId,deliverableId,v.extension);let temp:string|undefined,committed=false;
 try{temp=await stagePrivateFile(new Uint8Array(await file.arrayBuffer()));await commitStagedFile(temp,key);temp=undefined;committed=true;await prisma.$transaction(async tx=>{await lockAndAssertUnchanged(tx,deliverableId,d);await tx.deliverable.update({where:{id:deliverableId},data:{finalKind:"FILE",finalStorageKey:key,finalUrl:null,finalMimeType:v.mimeType,finalFileName:v.fileName,finalFileSize:v.size,finalUploadedAt:new Date()}});await tx.projectDeliveryAuditLog.create({data:{projectId,actorId,deliverableId,action:d.finalKind?"FINAL_ASSET_REPLACED":"FINAL_ASSET_ADDED"}})});if(d.finalStorageKey&&d.finalStorageKey!==key)await removePrivateFile(d.finalStorageKey).catch(()=>undefined);return{deliverableId}}
 catch(e){if(temp)await removeTempFile(temp).catch(()=>undefined);if(committed)await removePrivateFile(key).catch(()=>undefined);throw e}
}
export async function saveFinalUrl(actorId:string,projectId:string,versionId:string,deliverableId:string,raw:string){
 const d=await context(projectId,versionId,deliverableId);if(d.type!=="WEBSITE"&&d.type!=="OTHER")throw new FinalDeliveryError("Ce type de livrable n’accepte pas une URL finale.");const url=validateFinalUrl(raw);
 await prisma.$transaction(async tx=>{await lockAndAssertUnchanged(tx,deliverableId,d);await tx.deliverable.update({where:{id:deliverableId},data:{finalKind:"EXTERNAL_URL",finalStorageKey:null,finalUrl:url,finalMimeType:null,finalFileName:null,finalFileSize:null,finalUploadedAt:new Date()}});await tx.projectDeliveryAuditLog.create({data:{projectId,actorId,deliverableId,action:d.finalKind?"FINAL_ASSET_REPLACED":"FINAL_ASSET_ADDED"}})});if(d.finalStorageKey)await removePrivateFile(d.finalStorageKey).catch(()=>undefined);return{deliverableId}
}
export async function markProjectDelivered(actorId:string,projectId:string){
  return prisma.$transaction(async tx=>{
    const actor=await tx.user.findUnique({where:{id:actorId},select:{role:true}});
    if(actor?.role!=="ADMIN")throw new FinalDeliveryError("Seul un administrateur peut marquer le projet comme livré.");
    const project=await tx.project.findUnique({where:{id:projectId},select:{
      status:true,clientId:true,
      payments:{where:{type:"FINAL",status:"PAID"},select:{id:true},take:1},
      versions:{
        orderBy:{versionNumber:"desc"},take:1,
        select:{
          id:true,status:true,approval:true,
          deliverables:{where:{OR:[{finalKind:"FILE",finalStorageKey:{not:null}},{finalKind:"EXTERNAL_URL",finalUrl:{not:null}}]},select:{id:true},take:1}
        }
      }
    }});
    if(!project)throw new FinalDeliveryError("Projet introuvable.");
    const version=project.versions[0];
    if(project.status!=="READY_FOR_DELIVERY")throw new FinalDeliveryError("Le projet n’est plus prêt à être livré.");
    if(!project.payments.length)throw new FinalDeliveryError("Un paiement final validé est requis.");
    if(!version||version.status!=="APPROVED"||!version.approval)throw new FinalDeliveryError("La dernière version doit être approuvée.");
    if(!version.deliverables.length)throw new FinalDeliveryError("Ajoutez un livrable final valide.");
    const now=new Date();
    const claimed=await tx.project.updateMany({where:{id:projectId,status:"READY_FOR_DELIVERY"},data:{status:"DELIVERED",deliveredAt:now}});
    if(claimed.count!==1)throw new FinalDeliveryError("Le projet a déjà été livré.");
    await tx.projectVersion.update({where:{id:version.id},data:{status:"FINAL"}});
    await tx.projectDeliveryAuditLog.create({data:{projectId,actorId,action:"PROJECT_DELIVERED"}});
    await createNotification(tx,{recipientId:project.clientId,type:"PROJECT_DELIVERED",title:"Votre projet est livré",message:"Votre livraison finale est maintenant disponible.",link:`/client/projects/${projectId}`,dedupeKey:`project-delivered:${projectId}`});
    return{projectId,versionId:version.id,deliveredAt:now};
  });
}
