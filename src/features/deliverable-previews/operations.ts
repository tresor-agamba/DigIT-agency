import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { commitStagedFile, previewStorageKey, removePrivateFile, removeTempFile, stagePrivateFile } from "@/lib/storage/private-storage";
import { validateVideoFile, validateWebsiteUrl } from "./validation";

export class DeliverablePreviewError extends Error{}
type Metadata={name:string;description?:string};
const newId=()=>`c${randomBytes(12).toString("hex")}`;
async function versionExists(projectId:string,versionId:string){return prisma.projectVersion.findFirst({where:{id:versionId,projectId},select:{id:true}})}

export async function saveVideoPreview(projectId:string,versionId:string,metadata:Metadata,file:File,deliverableId?:string){
  const validated=validateVideoFile(file);if(!await versionExists(projectId,versionId))throw new DeliverablePreviewError("Version introuvable pour ce projet.");
  const existing=deliverableId?await prisma.deliverable.findFirst({where:{id:deliverableId,versionId,version:{projectId}},select:{id:true,previewStorageKey:true}}):null;if(deliverableId&&!existing)throw new DeliverablePreviewError("Livrable introuvable.");
  const id=existing?.id??newId();const storageKey=previewStorageKey(projectId,versionId,id,validated.extension);let temp:string|undefined;let committed=false;
  try{temp=await stagePrivateFile(new Uint8Array(await file.arrayBuffer()));await commitStagedFile(temp,storageKey);temp=undefined;committed=true;
    const data={name:metadata.name,description:metadata.description,type:"VIDEO" as const,fileName:validated.fileName,mimeType:validated.mimeType,fileSize:validated.size,fileUrl:null,previewKind:"FILE" as const,previewStorageKey:storageKey,previewUrl:null,previewMimeType:validated.mimeType,previewFileName:validated.fileName,previewFileSize:validated.size};
    const result=existing?await prisma.deliverable.update({where:{id},data,select:{id:true}}):await prisma.deliverable.create({data:{id,...data,versionId},select:{id:true}});
    if(existing?.previewStorageKey&&existing.previewStorageKey!==storageKey)await removePrivateFile(existing.previewStorageKey).catch(()=>undefined);return result;
  }catch(error){if(temp)await removeTempFile(temp).catch(()=>undefined);if(committed)await removePrivateFile(storageKey).catch(()=>undefined);throw error}
}

export async function saveWebsitePreview(projectId:string,versionId:string,metadata:Metadata,url:string,deliverableId?:string){const previewUrl=validateWebsiteUrl(url);if(!await versionExists(projectId,versionId))throw new DeliverablePreviewError("Version introuvable pour ce projet.");const existing=deliverableId?await prisma.deliverable.findFirst({where:{id:deliverableId,versionId,version:{projectId}},select:{id:true,previewStorageKey:true}}):null;if(deliverableId&&!existing)throw new DeliverablePreviewError("Livrable introuvable.");const data={name:metadata.name,description:metadata.description,type:"WEBSITE" as const,fileName:"staging-url",mimeType:null,fileSize:null,fileUrl:null,previewKind:"EXTERNAL_URL" as const,previewStorageKey:null,previewUrl,previewMimeType:null,previewFileName:null,previewFileSize:null};const result=existing?await prisma.deliverable.update({where:{id:existing.id},data,select:{id:true}}):await prisma.deliverable.create({data:{...data,versionId},select:{id:true}});if(existing?.previewStorageKey)await removePrivateFile(existing.previewStorageKey).catch(()=>undefined);return result}
