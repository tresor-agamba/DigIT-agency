"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { createRequestSchema, updateRequestSchema } from "@/features/modification-requests/validation";
import type { RequestActionState } from "@/features/modification-requests/types";
import { canRequestModification } from "@/features/version-approvals/policy";

const values = (formData: FormData) => Object.fromEntries(formData.entries());

export async function createModificationRequest(_: RequestActionState, formData: FormData): Promise<RequestActionState> {
  const client = await requireClient();
  const parsed = createRequestSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message };
  const version = await prisma.projectVersion.findFirst({ where: { id: parsed.data.versionId, projectId: parsed.data.projectId, project: { clientId: client.id } }, select: { id: true, status: true } });
  if (!version) return { status: "error", message: "Version introuvable." };
  if (!canRequestModification(version.status)) return { status: "error", message: "Une version approuvée ou finale n’accepte plus de nouvelle demande." };
  await prisma.modificationRequest.create({ data: { versionId: version.id, clientId: client.id, title: parsed.data.title, description: parsed.data.description } });
  revalidatePath(`/client/projects/${parsed.data.projectId}/versions/${version.id}`);
  return { status: "success", message: "Votre demande a été envoyée." };
}

export async function updateModificationRequest(_: RequestActionState, formData: FormData): Promise<RequestActionState> {
  await requireAdmin();
  const parsed = updateRequestSchema.safeParse(values(formData));
  if (!parsed.success) return { status: "error", message: "Informations invalides." };
  const request = await prisma.modificationRequest.findUnique({ where: { id: parsed.data.id }, select: { id: true } });
  if (!request) return { status: "error", message: "Demande introuvable." };
  const resolvedAt = ["COMPLETED", "REJECTED"].includes(parsed.data.status) ? new Date() : null;
  await prisma.modificationRequest.update({ where: { id: request.id }, data: { status: parsed.data.status, adminResponse: parsed.data.adminResponse, resolvedAt } });
  revalidatePath("/admin"); revalidatePath("/admin/requests"); revalidatePath(`/admin/requests/${request.id}`);
  return { status: "success", message: "Demande mise à jour." };
}
