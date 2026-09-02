"use server";

import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { publicOrderSchema } from "./validation";
import { formatOrderNumber } from "./number";
import type { OrderActionState } from "./types";
import { prisma } from "@/lib/prisma";

export async function createWebsiteOrder(_: OrderActionState, formData: FormData): Promise<OrderActionState> {
  const parsed = publicOrderSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { status: "error", message: parsed.error.issues[0]?.message ?? "Informations invalides." };

  const existing = await prisma.user.findFirst({ where: { OR: [...(parsed.data.email ? [{ email: parsed.data.email }] : []), { phone: parsed.data.phone }] }, select: { email: true, phone: true } });
  if (existing) return { status: "error", existingAccount: true, message: existing.email === parsed.data.email ? "Un compte existe déjà avec cette adresse email. Connectez-vous pour continuer." : "Un compte existe déjà avec ce numéro. Connectez-vous pour continuer." };
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  try {
    const order = await prisma.$transaction(async tx => {
      const service = await tx.service.findFirst({ where: { id: parsed.data.serviceId, isActive: true }, select: { id: true, name: true } });
      if (!service) throw new PublicOrderError("Le service sélectionné est indisponible.");
      const client = await tx.user.create({ data: { name: parsed.data.name, email: parsed.data.email ?? null, phone: parsed.data.phone, passwordHash, role: "CLIENT" }, select: { id: true } });
      const [sequence] = await tx.$queryRaw<Array<{ value: bigint }>>`SELECT nextval('"OrderNumberSequence"')::bigint AS value`;
      if (!sequence) throw new PublicOrderError("Impossible de générer le numéro de commande.");
      const created = await tx.order.create({ data: { orderNumber: formatOrderNumber(sequence.value), clientId: client.id, serviceId: service.id, source: "WEBSITE", status: "NEW", title: parsed.data.title, description: parsed.data.description, companyName: parsed.data.companyName, budget: parsed.data.budget === undefined ? null : new Prisma.Decimal(parsed.data.budget), currency: parsed.data.currency, desiredDeadline: parsed.data.desiredDeadline }, select: { orderNumber: true, status: true, createdAt: true } });
      return { ...created, serviceName: service.name };
    });
    return { status: "success", message: "Commande reçue", order: { orderNumber: order.orderNumber, serviceName: order.serviceName, status: "NEW", createdAt: order.createdAt.toISOString() } };
  } catch (error) {
    if (error instanceof PublicOrderError) return { status: "error", message: error.message };
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") { const emailCollision=String(error.meta?.target??"").includes("email"); return { status: "error", existingAccount: true, message: emailCollision ? "Un compte existe déjà avec cette adresse email. Connectez-vous pour continuer." : "Un compte existe déjà avec ce numéro. Connectez-vous pour continuer." }; }
    return { status: "error", message: "La commande n’a pas pu être créée. Réessayez." };
  }
}

class PublicOrderError extends Error {}
