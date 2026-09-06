import { createReadStream } from "node:fs";
import { mkdir, open, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ByteRange } from "./types";

export class PrivateStorageError extends Error {}

export function privateStorageRoot() {
  const configured=process.env.PRIVATE_STORAGE_ROOT?.trim();
  if(!configured) throw new PrivateStorageError("PRIVATE_STORAGE_ROOT n’est pas configuré.");
  return path.resolve(configured);
}

export function resolvePrivateStorageKey(storageKey:string){
  const isAbsolute=path.posix.isAbsolute(storageKey)||path.win32.isAbsolute(storageKey);
  if(!storageKey||isAbsolute||storageKey.includes("\0"))throw new PrivateStorageError("Clé de stockage invalide.");
  const root=privateStorageRoot();const target=path.resolve(root,...storageKey.split("/"));
  if(target!==root&&!target.startsWith(`${root}${path.sep}`))throw new PrivateStorageError("Clé de stockage hors racine.");
  return target;
}

export function previewStorageKey(projectId:string,versionId:string,deliverableId:string,extension:string){
  const safeId=/^[a-z0-9_-]+$/i;if(!safeId.test(projectId)||!safeId.test(versionId)||!safeId.test(deliverableId)||!/^\.(mp4|webm)$/.test(extension))throw new PrivateStorageError("Identifiant de stockage invalide.");
  return `projects/${projectId}/versions/${versionId}/previews/${deliverableId}/${randomUUID()}${extension}`;
}
export function paymentProofStorageKey(projectId:string,paymentId:string,extension:string){const safe=/^[a-z0-9_-]+$/i;if(!safe.test(projectId)||!safe.test(paymentId)||!/^\.(jpg|jpeg|png|webp|pdf)$/.test(extension))throw new PrivateStorageError("Identifiant de stockage invalide.");return`projects/${projectId}/payments/${paymentId}/proofs/${randomUUID()}${extension}`}
export function finalStorageKey(projectId:string,versionId:string,deliverableId:string,extension:string){const safe=/^[a-z0-9_-]+$/i;if(!safe.test(projectId)||!safe.test(versionId)||!safe.test(deliverableId)||!/^\.[a-z0-9]{1,8}$/i.test(extension))throw new PrivateStorageError("Identifiant de stockage invalide.");return`projects/${projectId}/versions/${versionId}/finals/${deliverableId}/${randomUUID()}${extension.toLowerCase()}`}

export async function stagePrivateFile(bytes:Uint8Array){const root=privateStorageRoot();const tempDir=path.join(root,".tmp");await mkdir(tempDir,{recursive:true});const tempPath=path.join(tempDir,`${randomUUID()}.upload`);const handle=await open(tempPath,"wx",0o600);try{await handle.writeFile(bytes);await handle.sync()}finally{await handle.close()}return tempPath}
export async function commitStagedFile(tempPath:string,storageKey:string){const target=resolvePrivateStorageKey(storageKey);await mkdir(path.dirname(target),{recursive:true});await rename(tempPath,target);return target}
export async function removePrivateFile(storageKey:string|null|undefined){if(!storageKey)return;await rm(resolvePrivateStorageKey(storageKey),{force:true})}
export async function removeTempFile(tempPath:string|null|undefined){if(!tempPath)return;const tempRoot=path.join(privateStorageRoot(),".tmp");const resolved=path.resolve(tempPath);if(!resolved.startsWith(`${tempRoot}${path.sep}`))throw new PrivateStorageError("Fichier temporaire hors racine.");await rm(resolved,{force:true})}
export async function privateFileInfo(storageKey:string){const absolutePath=resolvePrivateStorageKey(storageKey);const info=await stat(absolutePath);if(!info.isFile())throw new PrivateStorageError("Preview privée introuvable.");return{absolutePath,size:info.size}}
export function privateFileStream(absolutePath:string,range?:ByteRange){return createReadStream(absolutePath,range)}

export function parseByteRange(header:string|null,size:number):ByteRange|null|"invalid"{if(!header)return null;const match=/^bytes=(\d*)-(\d*)$/.exec(header.trim());if(!match)return"invalid";let start:number;let end:number;if(match[1]===""){const suffix=Number(match[2]);if(!Number.isInteger(suffix)||suffix<=0)return"invalid";start=Math.max(size-suffix,0);end=size-1}else{start=Number(match[1]);end=match[2]?Number(match[2]):size-1}if(!Number.isInteger(start)||!Number.isInteger(end)||start<0||end<start||start>=size)return"invalid";return{start,end:Math.min(end,size-1)}}
