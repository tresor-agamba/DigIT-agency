import { z } from "zod";

export const idSchema = z.string().cuid();
export const versionStatusSchema = z.enum(["DRAFT", "READY_FOR_REVIEW", "APPROVED", "CHANGES_REQUESTED", "FINAL"]);
export const deliverableTypeSchema = z.enum(["VIDEO", "WEBSITE", "MOBILE_APP", "DOCUMENT", "ARCHIVE", "OTHER"]);

export const versionSchema = z.object({ projectId: idSchema, versionNumber: z.coerce.number().int().positive(), name: z.string().trim().min(2).max(160), description: z.string().trim().max(2000).optional().transform((v) => v || undefined), status: versionStatusSchema.default("DRAFT") });
export const updateVersionSchema = versionSchema.omit({ versionNumber: true }).extend({ versionId: idSchema });
export const deliverableSchema = z.object({ projectId: idSchema, versionId: idSchema, name: z.string().trim().min(2).max(160), type: deliverableTypeSchema, description: z.string().trim().max(2000).optional().transform((v) => v || undefined), fileName: z.string().trim().min(1).max(255), mimeType: z.string().trim().max(150).optional().transform((v) => v || undefined), fileSize: z.union([z.literal(""), z.coerce.number().int().positive().max(2147483647)]).optional().transform((v) => v === "" ? undefined : v), fileUrl: z.union([z.literal(""), z.string().url()]).optional().transform((v) => v || undefined) });
export const updateDeliverableSchema = deliverableSchema.extend({ deliverableId: idSchema });
