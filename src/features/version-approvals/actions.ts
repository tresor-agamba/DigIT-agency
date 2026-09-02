"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { idSchema } from "@/features/versions/validation";
import { canApproveVersion } from "@/features/version-approvals/policy";
import type { ApprovalActionState } from "@/features/version-approvals/types";

export async function approveVersion(
  _: ApprovalActionState,
  formData: FormData,
): Promise<ApprovalActionState> {
  const client = await requireClient();
  const projectId = idSchema.safeParse(formData.get("projectId"));
  const versionId = idSchema.safeParse(formData.get("versionId"));
  if (!projectId.success || !versionId.success) {
    return { status: "error", message: "Informations invalides." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const version = await tx.projectVersion.findFirst({
        where: {
          id: versionId.data,
          projectId: projectId.data,
          project: { clientId: client.id },
        },
        select: { id: true, status: true, approval: { select: { id: true } } },
      });

      if (!version) throw new ApprovalError("Version introuvable.");
      if (!canApproveVersion(version.status, Boolean(version.approval))) {
        throw new ApprovalError(
          version.approval || version.status === "APPROVED"
            ? "Cette version a déjà été approuvée."
            : "Seule une version prête à être examinée peut être approuvée.",
        );
      }

      const approvedAt = new Date();
      await tx.versionApproval.create({
        data: { versionId: version.id, clientId: client.id, approvedAt },
      });
      await tx.projectVersion.update({
        where: { id: version.id },
        data: { status: "APPROVED" },
      });
    });
  } catch (error) {
    if (error instanceof ApprovalError) return { status: "error", message: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "error", message: "Cette version a déjà été approuvée." };
    }
    return { status: "error", message: "L’approbation n’a pas pu être enregistrée." };
  }

  revalidatePath(`/client/projects/${projectId.data}/versions/${versionId.data}`);
  revalidatePath(`/client/projects/${projectId.data}`);
  revalidatePath(`/admin/projects/${projectId.data}/versions/${versionId.data}`);
  return { status: "success", message: "Version approuvée" };
}

class ApprovalError extends Error {}
