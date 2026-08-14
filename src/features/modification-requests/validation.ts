import { z } from "zod";
export const idSchema=z.string().cuid();
export const createRequestSchema=z.object({projectId:idSchema,versionId:idSchema,title:z.string().trim().min(3,"Le titre doit contenir au moins 3 caractères.").max(120),description:z.string().trim().min(10,"Décrivez votre demande en au moins 10 caractères.").max(2000)});
export const updateRequestSchema=z.object({id:idSchema,status:z.enum(["PENDING","IN_PROGRESS","COMPLETED","REJECTED"]),adminResponse:z.string().trim().max(2000).optional().transform(v=>v||undefined)});
