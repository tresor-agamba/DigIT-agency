import path from "node:path";
import { z } from "zod";
import { idSchema } from "@/features/versions/validation";

export const previewMetadataSchema=z.object({name:z.string().trim().min(2).max(160),description:z.string().trim().max(2000).optional().transform(v=>v||undefined)});
export const previewReferenceSchema=z.object({projectId:idSchema,versionId:idSchema,deliverableId:idSchema.optional()});
const allowedMime=new Map([["video/mp4",".mp4"],["video/webm",".webm"]]);
export function maxPreviewBytes(){const mb=Number.parseInt(process.env.MAX_PREVIEW_UPLOAD_MB??"200",10);if(!Number.isFinite(mb)||mb<=0)throw new Error("MAX_PREVIEW_UPLOAD_MB invalide.");return mb*1024*1024}
export function sanitizeFileName(name:string){const clean=path.basename(name).replace(/[^a-zA-Z0-9._ -]/g,"_").slice(0,180);return clean||"preview"}
export function validateVideoFile(file:File){if(!(file instanceof File))throw new Error("Fichier preview requis.");if(file.size<=0)throw new Error("Le fichier est vide.");if(file.size>maxPreviewBytes())throw new Error("Le fichier dépasse la taille maximale autorisée.");const extension=path.extname(file.name).toLowerCase();const expected=allowedMime.get(file.type);if(!expected)throw new Error("Seuls les fichiers MP4 et WEBM sont autorisés.");if(extension!==expected)throw new Error("L’extension ne correspond pas au type vidéo annoncé.");return{extension,mimeType:file.type,fileName:sanitizeFileName(file.name),size:file.size}}
export function validateWebsiteUrl(raw:string){const parsed=new URL(raw.trim());if(!["http:","https:"].includes(parsed.protocol))throw new Error("Protocole d’URL interdit.");const local=["localhost","127.0.0.1","::1"].includes(parsed.hostname);if(parsed.protocol!=="https:"&&process.env.NODE_ENV==="production"&&!local)throw new Error("HTTPS est obligatoire en production.");return parsed.toString()}
