import { prisma } from "@/lib/prisma";

export function findClientProjects(clientId: string, query?: string) {
  const q = query?.trim();
  return prisma.project.findMany({ where: { clientId, ...(q ? { name: { contains: q, mode: "insensitive" } } : {}) }, select: { id: true, name: true, type: true, status: true, updatedAt: true, _count: { select: { versions: true } } }, orderBy: { updatedAt: "desc" } });
}

export function findClientProject(clientId: string, projectId: string) {
  return prisma.project.findFirst({ where: { id: projectId, clientId }, select: { id: true, name: true, type: true, description: true, status: true, createdAt: true, updatedAt: true, versions: { select: { id: true, versionNumber: true, name: true, description: true, status: true, createdAt: true, _count: { select: { deliverables: true } } }, orderBy: { versionNumber: "desc" } } } });
}

export function findClientVersion(clientId: string, projectId: string, versionId: string) {
  return prisma.projectVersion.findFirst({ where: { id: versionId, projectId, project: { clientId } }, select: { id: true, versionNumber: true, name: true, description: true, status: true, createdAt: true, project: { select: { id: true, name: true } }, deliverables: { select: { id: true, name: true, type: true, description: true, fileName: true, mimeType: true, fileSize: true, fileUrl: true, createdAt: true }, orderBy: { createdAt: "desc" } }, modificationRequests: { where: { clientId }, select: { id: true, title: true, description: true, status: true, adminResponse: true, createdAt: true }, orderBy: { createdAt: "desc" } } } });
}
