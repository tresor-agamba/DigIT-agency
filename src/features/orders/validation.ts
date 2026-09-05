import { z } from "zod";
import { phoneSchema } from "@/lib/validation/phone";
import { optionalEmailSchema } from "@/lib/validation/email";

const optionalText = (max: number) => z.string().trim().max(max).transform(value => value || undefined);
const optionalBudget = z.preprocess(value => value === "" || value == null ? undefined : value, z.coerce.number().finite().min(0, "Le budget ne peut pas être négatif.").optional());
const optionalDeadline = z.preprocess(value => value === "" || value == null ? undefined : value, z.coerce.date({ error: "Le délai souhaité est invalide." }).optional());

export const publicOrderSchema = z.object({
  name: z.string().trim().min(2, "Le nom complet est requis.").max(120),
  email: optionalEmailSchema,
  phone: phoneSchema,
  password: z.string().min(12, "Le mot de passe doit contenir au moins 12 caractères.").max(128),
  passwordConfirmation: z.string(),
  companyName: optionalText(160),
  serviceId: z.string().cuid("Le service sélectionné est invalide."),
  title: z.string().trim().min(3, "Le titre est requis.").max(160),
  description: z.string().trim().min(20, "Décrivez votre besoin en au moins 20 caractères.").max(5000),
  budget: optionalBudget,
  currency: z.string().trim().min(1, "La devise est obligatoire.").max(3).transform(value => value.toUpperCase()),
  desiredDeadline: optionalDeadline,
  whatsappOptIn:z.preprocess(value=>value==="on"||value===true,z.boolean()),
}).refine(data => data.password === data.passwordConfirmation, { path: ["passwordConfirmation"], message: "Les mots de passe ne correspondent pas." });
