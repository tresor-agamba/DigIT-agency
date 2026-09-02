import { prisma } from "@/lib/prisma";

export const publicServiceSelect = { id: true, name: true, slug: true, shortDescription: true, description: true, category: true, basePrice: true, currency: true, priceType: true, imageUrl: true } as const;
const orderBy = [{ displayOrder: "asc" as const }, { createdAt: "desc" as const }];

export function findActiveServices() {
  return prisma.service.findMany({ where: { isActive: true }, select: publicServiceSelect, orderBy });
}

export async function findHomepageServices(limit = 6) {
  const featured = await prisma.service.findMany({ where: { isActive: true, isFeatured: true }, select: publicServiceSelect, orderBy, take: limit });
  return featured.length ? featured : prisma.service.findMany({ where: { isActive: true }, select: publicServiceSelect, orderBy, take: limit });
}

export function findActiveServiceBySlug(slug: string) {
  return prisma.service.findFirst({ where: { slug, isActive: true }, select: publicServiceSelect });
}
