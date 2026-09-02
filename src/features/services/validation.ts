import { z } from "zod";

const optionalUrl = z.string().trim().refine(value => !value || z.url().safeParse(value).success, "L’URL de l’image est invalide.").transform(value => value || undefined);
const price = z.preprocess(value => value === "" || value == null ? undefined : value, z.coerce.number().finite().min(0, "Le prix doit être positif ou nul.").optional());

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Le nom est obligatoire.").max(120),
  category: z.string().trim().min(1, "La catégorie est obligatoire.").max(80),
  shortDescription: z.string().trim().min(1, "La description courte est obligatoire.").max(240),
  description: z.string().trim().min(1, "La description détaillée est obligatoire.").max(5000),
  priceType: z.enum(["FIXED", "STARTING_AT", "QUOTE"]),
  projectType: z.enum(["SITE_WEB", "MOBILE_APP", "AD_VIDEO", "OTHER"]).default("OTHER"),
  basePrice: price,
  currency: z.string().trim().min(1, "La devise est obligatoire.").max(3).transform(value => value.toUpperCase()),
  imageUrl: optionalUrl,
  displayOrder: z.coerce.number().int("L’ordre doit être un entier.").min(0, "L’ordre ne peut pas être négatif."),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.priceType !== "QUOTE" && data.basePrice === undefined) ctx.addIssue({ code: "custom", path: ["basePrice"], message: "Un prix de base est obligatoire pour ce type de prix." });
});

export const updateServiceSchema = serviceSchema.and(z.object({ id: z.string().cuid() }));
export const toggleServiceSchema = z.object({ id: z.string().cuid(), isActive: z.boolean() });
