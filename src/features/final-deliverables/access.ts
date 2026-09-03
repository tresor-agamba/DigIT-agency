import type{UserRole}from"@prisma/client";import{prisma}from"@/lib/prisma";import{canAccessFinalDeliverable}from"./policy";import{createFinalDownloadResponse}from"./download";
export type FinalActor={id:string;role:UserRole}|null;
export async function getFinalDownloadResponse(id:string,actor:FinalActor){
 if(!actor)return new Response("Non authentifié",{status:401});
 const d=await prisma.deliverable.findUnique({where:{id},select:{finalKind:true,finalStorageKey:true,finalMimeType:true,finalFileName:true,version:{select:{project:{select:{clientId:true,status:true,payments:{where:{type:"FINAL",status:"PAID"},select:{id:true},take:1}}}}}}});
 if(!d||d.finalKind!=="FILE"||!d.finalStorageKey||!d.finalMimeType||!d.finalFileName)return new Response("Introuvable",{status:404});
 if(!canAccessFinalDeliverable(actor.role,actor.id,d.version.project.clientId,d.version.project.status,d.version.project.payments.length>0))return new Response("Interdit",{status:403});
 try{return await createFinalDownloadResponse(d.finalStorageKey,d.finalMimeType,d.finalFileName)}catch{return new Response("Introuvable",{status:404})}
}
