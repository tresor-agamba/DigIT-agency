import Link from "next/link";
import { ProjectForm } from "@/app/admin/projects/project-form";
import { prisma } from "@/lib/prisma";

export default async function NewProjectPage() {
  const clients = await prisma.user.findMany({ where: { role: "CLIENT" }, select: { id: true, name: true, phone: true, isActive: true }, orderBy: { name: "asc" } });
  return <main className="mx-auto max-w-3xl px-6 py-12 text-white"><Link href="/admin/projects" className="text-sm font-medium text-electric-mint">← Projets</Link><p className="mt-7 text-sm font-semibold tracking-[0.18em] text-electric-mint">NOUVEAU PROJET</p><h1 className="mt-3 text-4xl font-bold">Créer un projet</h1><p className="mt-2 text-muted">Associez obligatoirement ce projet à un client existant.</p>{clients.length ? <ProjectForm clients={clients} /> : <p className="mt-8 rounded-2xl border border-white/10 bg-graphite-secondary p-6 text-muted">Créez d’abord un client avant d’ajouter un projet.</p>}</main>;
}
