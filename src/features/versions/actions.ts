"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { deliverableSchema, updateDeliverableSchema, updateVersionSchema, versionSchema } from "@/features/versions/validation";
import type { ActionState } from "@/features/versions/types";

const values = (formData: FormData) => Object.fromEntries(formData.entries());
const refresh = (projectId: string, versionId?: string) => { revalidatePath(`/admin/projects/${projectId}`); if (versionId) revalidatePath(`/admin/projects/${projectId}/versions/${versionId}`); };

export async function createVersion(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = versionSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  if (!await prisma.project.findUnique({ where: { id: parsed.data.projectId }, select: { id: true } })) return { status: "error", message: "Projet introuvable." };
  try { const version = await prisma.projectVersion.create({ data: parsed.data, select: { id: true } }); refresh(parsed.data.projectId); return { status: "success", message: "Version créée avec succès.", id: version.id }; }
  catch (error) { if (typeof error === "object" && error && "code" in error && error.code === "P2002") return { status: "error", message: "Ce numéro de version existe déjà pour ce projet." }; return { status: "error", message: "La création a échoué." }; }
}

export async function updateVersion(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = updateVersionSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: "Informations invalides." };
  const version = await prisma.projectVersion.findFirst({ where: { id: parsed.data.versionId, projectId: parsed.data.projectId }, select: { id: true } });
  if (!version) return { status: "error", message: "Version introuvable pour ce projet." };
  await prisma.projectVersion.update({ where: { id: version.id }, data: { name: parsed.data.name, description: parsed.data.description, status: parsed.data.status } }); refresh(parsed.data.projectId, version.id); return { status: "success", message: "Version mise à jour." };
}

export async function createDeliverable(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = deliverableSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };
  const version = await prisma.projectVersion.findFirst({ where: { id: parsed.data.versionId, projectId: parsed.data.projectId }, select: { id: true } });
  if (!version) return { status: "error", message: "Version introuvable pour ce projet." };
  await prisma.deliverable.create({ data: { ...parsed.data, versionId: version.id }, select: { id: true } }); refresh(parsed.data.projectId, version.id); return { status: "success", message: "Métadonnées du livrable ajoutées." };
}

export async function updateDeliverable(_: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin(); const parsed = updateDeliverableSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: "Informations invalides." };
  const deliverable = await prisma.deliverable.findFirst({ where: { id: parsed.data.deliverableId, versionId: parsed.data.versionId, version: { projectId: parsed.data.projectId } }, select: { id: true } });
  if (!deliverable) return { status: "error", message: "Livrable introuvable pour cette version." };
  await prisma.deliverable.update({ where: { id: deliverable.id }, data: { name: parsed.data.name, type: parsed.data.type, description: parsed.data.description, fileName: parsed.data.fileName, mimeType: parsed.data.mimeType, fileSize: parsed.data.fileSize, fileUrl: parsed.data.fileUrl } }); refresh(parsed.data.projectId, parsed.data.versionId); return { status: "success", message: "Livrable mis à jour." };
}
