import { z } from "zod";
import { phoneSchema } from "@/lib/validation/phone";

export const clientIdSchema = z.string().cuid();

export const createClientSchema = z.object({
  name: z.string().trim().min(2, "Le nom complet est requis.").max(120),
  phone: phoneSchema,
  temporaryPassword: z.string().min(12, "Le mot de passe temporaire doit contenir au moins 12 caractères.").max(128),
});

export const updateClientSchema = z.object({
  id: clientIdSchema,
  name: z.string().trim().min(2, "Le nom complet est requis.").max(120),
  phone: phoneSchema,
  isActive: z.boolean(),
});
