import { z } from "zod";
export function normalizeEmail(value:string){return value.trim().toLowerCase()}
export const emailSchema=z.string().transform(normalizeEmail).pipe(z.email("Adresse email invalide."));
export const optionalEmailSchema=z.preprocess(value=>typeof value==="string"&&value.trim()===""?undefined:value,emailSchema.optional());
