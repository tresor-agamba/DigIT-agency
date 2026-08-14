"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { createClientSchema, updateClientSchema } from "@/features/clients/validation";
import type { ClientActionState } from "@/features/clients/types";

function formValues(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createClient(_: ClientActionState, formData: FormData): Promise<ClientActionState> {
  await requireAdmin();
  const parsed = createClientSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };

  const existing = await prisma.user.findUnique({ where: { phone: parsed.data.phone }, select: { id: true } });
  if (existing) return { status: "error", message: "Ce numéro de téléphone est déjà utilisé par un compte." };

  const passwordHash = await bcrypt.hash(parsed.data.temporaryPassword, 12);
  try {
    const client = await prisma.user.create({ data: { name: parsed.data.name, phone: parsed.data.phone, passwordHash, role: "CLIENT" }, select: { id: true, phone: true } });
    revalidatePath("/admin");
    revalidatePath("/admin/clients");
    return { status: "success", message: "Client créé avec succès.", phone: client.phone, id: client.id };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { status: "error", message: "Ce numéro de téléphone est déjà utilisé par un compte." };
    return { status: "error", message: "La création du client a échoué. Réessayez." };
  }
}

export async function updateClient(_: ClientActionState, formData: FormData): Promise<ClientActionState> {
  await requireAdmin();
  const parsed = updateClientSchema.safeParse({ ...formValues(formData), isActive: formData.get("isActive") === "true" });
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };

  const client = await prisma.user.findFirst({ where: { id: parsed.data.id, role: "CLIENT" }, select: { id: true } });
  if (!client) return { status: "error", message: "Client introuvable." };
  const samePhone = await prisma.user.findFirst({ where: { phone: parsed.data.phone, NOT: { id: client.id } }, select: { id: true } });
  if (samePhone) return { status: "error", message: "Ce numéro de téléphone est déjà utilisé par un compte." };

  await prisma.user.update({ where: { id: client.id }, data: { name: parsed.data.name, phone: parsed.data.phone, isActive: parsed.data.isActive } });
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${client.id}`);
  return { status: "success", message: parsed.data.isActive ? "Client mis à jour avec succès." : "Client désactivé avec succès." };
}
