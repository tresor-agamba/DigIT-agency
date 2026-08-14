"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { createProjectSchema, updateProjectSchema } from "@/features/projects/validation";
import type { ProjectActionState } from "@/features/projects/types";

function formValues(formData: FormData) { return Object.fromEntries(formData.entries()); }

async function isClientAccount(clientId: string) {
  return prisma.user.findFirst({ where: { id: clientId, role: "CLIENT" }, select: { id: true } });
}

export async function createProject(_: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  const parsed = createProjectSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  if (!(await isClientAccount(parsed.data.clientId))) return { status: "error", message: "Le client sélectionné est invalide." };

  const project = await prisma.project.create({ data: parsed.data, select: { id: true } });
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  return { status: "success", message: "Projet créé avec succès.", id: project.id };
}

export async function updateProject(_: ProjectActionState, formData: FormData): Promise<ProjectActionState> {
  await requireAdmin();
  const parsed = updateProjectSchema.safeParse(formValues(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  if (!(await isClientAccount(parsed.data.clientId))) return { status: "error", message: "Le client sélectionné est invalide." };
  const project = await prisma.project.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!project) return { status: "error", message: "Projet introuvable." };

  await prisma.project.update({ where: { id: project.id }, data: parsed.data });
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${project.id}`);
  return { status: "success", message: "Projet mis à jour avec succès.", id: project.id };
}
