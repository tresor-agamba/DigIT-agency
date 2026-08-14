import Link from "next/link";
import { notFound } from "next/navigation";
import { ClientEditForm } from "@/app/admin/clients/[id]/client-edit-form";
import { clientIdSchema } from "@/features/clients/validation";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ id: string }> };

export default async function ClientDetailPage({ params }: PageProps) {
  const parsed = clientIdSchema.safeParse((await params).id);
  if (!parsed.success) notFound();
  const client = await prisma.user.findFirst({ where: { id: parsed.data, role: "CLIENT" }, select: { id: true, name: true, phone: true, isActive: true, createdAt: true, updatedAt: true, _count: { select: { projects: true } } } });
  if (!client) notFound();

  return <main className="mx-auto max-w-4xl px-6 py-12 text-white"><Link href="/admin/clients" className="text-sm font-medium text-electric-mint">← Clients</Link><div className="mt-5"><p className="text-sm font-semibold tracking-[0.18em] text-electric-mint">FICHE CLIENT</p><h1 className="mt-3 text-4xl font-bold">{client.name}</h1></div>
    <dl className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-graphite-secondary p-6 sm:grid-cols-2"><div><dt className="text-sm text-muted">Téléphone</dt><dd className="mt-1">{client.phone}</dd></div><div><dt className="text-sm text-muted">Statut</dt><dd className={`mt-1 ${client.isActive ? "text-electric-mint" : "text-muted"}`}>{client.isActive ? "ACTIF" : "INACTIF"}</dd></div><div><dt className="text-sm text-muted">Créé le</dt><dd className="mt-1">{client.createdAt.toLocaleDateString("fr-FR")}</dd></div><div><dt className="text-sm text-muted">Dernière modification</dt><dd className="mt-1">{client.updatedAt.toLocaleDateString("fr-FR")}</dd></div><div><dt className="text-sm text-muted">Nombre de projets</dt><dd className="mt-1">{client._count.projects}</dd></div></dl>
    <section className="mt-10"><h2 className="text-2xl font-bold">Modifier le client</h2><ClientEditForm client={client} /></section>
    <section className="mt-10 rounded-2xl border border-white/10 p-6"><h2 className="text-xl font-bold">Projets</h2><p className="mt-2 text-muted">{client._count.projects === 0 ? "Projets : aucun projet" : `${client._count.projects} projet(s)`}</p></section>
  </main>;
}
