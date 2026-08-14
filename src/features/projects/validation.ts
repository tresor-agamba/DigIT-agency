import { z } from "zod";

export const projectIdSchema = z.string().cuid();
export const projectTypeSchema = z.enum(["SITE_WEB", "MOBILE_APP", "AD_VIDEO"]);
export const projectStatusSchema = z.enum(["DRAFT", "IN_PROGRESS", "REVIEW", "CHANGES_REQUESTED", "APPROVED", "PAYMENT_PENDING", "READY_FOR_DELIVERY", "DELIVERED"]);

const projectFields = {
  clientId: z.string().cuid(),
  name: z.string().trim().min(2, "Le nom du projet est requis.").max(160),
  type: projectTypeSchema,
  description: z.string().trim().max(2000).optional().transform((value) => value || undefined),
  status: projectStatusSchema.default("DRAFT"),
};

export const createProjectSchema = z.object(projectFields);
export const updateProjectSchema = z.object({ id: projectIdSchema, ...projectFields });
