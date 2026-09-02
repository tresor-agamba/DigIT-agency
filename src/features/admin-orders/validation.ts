import { z } from "zod";

export const orderIdSchema=z.string().cuid("Identifiant de commande invalide.");
export const statusUpdateSchema=z.object({id:orderIdSchema,status:z.enum(["NEW","UNDER_REVIEW","NEEDS_INFORMATION","QUOTED","ACCEPTED","REJECTED","CANCELLED","CONVERTED_TO_PROJECT"])});
const decimalString=z.string().trim().regex(/^\d{1,10}(?:\.\d{1,2})?$/, "Le montant doit être un nombre positif avec deux décimales maximum.");
export const quoteUpdateSchema=z.object({id:orderIdSchema,quotedAmount:decimalString});
export const notesUpdateSchema=z.object({id:orderIdSchema,adminNotes:z.string().trim().max(5000,"Les notes ne peuvent pas dépasser 5000 caractères.")});

export function parseOrdersPage(value:string|undefined){const parsed=z.coerce.number().int().min(1).max(100000).safeParse(value??"1");return parsed.success?parsed.data:1}
