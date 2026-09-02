"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { serviceSchema, toggleServiceSchema, updateServiceSchema } from "./validation";
import { slugCandidate, slugifyServiceName } from "./slug";
import type { ServiceActionState } from "./types";

function values(formData: FormData) {
  return { ...Object.fromEntries(formData.entries()), isActive: formData.get("isActive") === "true", isFeatured: formData.get("isFeatured") === "true" };
}

function serviceData(data: ReturnType<typeof serviceSchema.parse>) {
  return { ...data, basePrice: data.priceType === "QUOTE" ? null : new Prisma.Decimal(data.basePrice!), imageUrl: data.imageUrl ?? null };
}

export async function createService(_: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  const baseSlug = slugifyServiceName(parsed.data.name);
  for (let attempt = 1; attempt <= 100; attempt++) {
    try {
      const service = await prisma.service.create({ data: { ...serviceData(parsed.data), slug: slugCandidate(baseSlug, attempt) }, select: { id: true } });
      revalidatePath("/admin/services");
      return { status: "success", message: "Service créé avec succès.", id: service.id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") continue;
      return { status: "error", message: "La création du service a échoué." };
    }
  }
  return { status: "error", message: "Impossible de générer un slug unique." };
}

export async function updateService(_: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const parsed = updateServiceSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  const existing = await prisma.service.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!existing) return { status: "error", message: "Service introuvable." };
  const { id, ...data } = parsed.data;
  await prisma.service.update({ where: { id }, data: serviceData(data) });
  revalidatePath("/admin/services"); revalidatePath(`/admin/services/${id}`);
  return { status: "success", message: "Service mis à jour.", id };
}

export async function toggleServiceStatus(_: ServiceActionState, formData: FormData): Promise<ServiceActionState> {
  await requireAdmin();
  const parsed = toggleServiceSchema.safeParse({ id: formData.get("id"), isActive: formData.get("isActive") === "true" });
  if (!parsed.success) return { status: "error", message: "Informations invalides." };
  const result = await prisma.service.updateMany({ where: { id: parsed.data.id }, data: { isActive: parsed.data.isActive } });
  if (!result.count) return { status: "error", message: "Service introuvable." };
  revalidatePath("/admin/services"); revalidatePath(`/admin/services/${parsed.data.id}`);
  return { status: "success", message: parsed.data.isActive ? "Service activé." : "Service désactivé." };
}
