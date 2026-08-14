import Link from "next/link";
import { ClientCreateForm } from "@/app/admin/clients/client-create-form";
import { prisma } from "@/lib/prisma";

type PageProps = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function ClientsPage({ searchParams }: PageProps) {
  const { q = "", status = "all" } = await searchParams;
  const query = q.trim();
  const isActive = status === "active" ? true : status === "inactive" ? false : undefined;
  const clients = await prisma.user.findMany({ where: { role: "CLIENT", ...(isActive === undefined ? {} : { isActive }), ...(query ? { OR: [{ name: { contains: query, mode: "insensitive" } }, { phone: { contains: query } }] } : {}) }, select: { id: true, name: true, phone: true, isActive: true, createdAt: true, _count: { select: { projects: true } } }, orderBy: { createdAt: "desc" } });
  const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });

  return <main className="mx-auto max-w-6xl px-6 py-12 text-white"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold tracking-[0.18em] text-electric-mint">CLIENTS</p><h1 className="mt-3 text-4xl font-bold">Gestion des clients</h1><p className="mt-2 text-muted">{totalClients} client{totalClients > 1 ? "s" : ""} au total</p></div><a href="#nouveau-client" className="rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite">+ Nouveau client</a></div>
    <form className="mt-10 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Rechercher par nom ou téléphone" className="min-w-64 flex-1 rounded-xl border border-white/15 bg-graphite-secondary px-4 py-3 outline-none focus:border-electric-mint" /><select name="status" defaultValue={status} className="rounded-xl border border-white/15 bg-graphite-secondary px-4 py-3"><option value="all">Tous</option><option value="active">Actifs</option><option value="inactive">Inactifs</option></select><button className="rounded-xl border border-white/15 px-5 py-3 font-medium">Rechercher</button></form>
    <section className="mt-6 overflow-hidden rounded-2xl border border-white/10"><div className="grid grid-cols-[1.4fr_1.2fr_.7fr_.7fr] gap-4 border-b border-white/10 bg-graphite-secondary px-5 py-4 text-xs font-semibold uppercase tracking-wide text-muted"><span>Client</span><span>Téléphone</span><span>Projets</span><span>Statut</span></div>{clients.length ? clients.map((client) => <Link key={client.id} href={`/admin/clients/${client.id}`} className="grid grid-cols-[1.4fr_1.2fr_.7fr_.7fr] gap-4 border-b border-white/5 px-5 py-4 transition hover:bg-white/5"><span><strong className="block">{client.name}</strong><small className="text-muted">{client.createdAt.toLocaleDateString("fr-FR")}</small></span><span className="text-sm text-muted">{client.phone}</span><span>{client._count.projects}</span><span className={client.isActive ? "text-electric-mint" : "text-muted"}>{client.isActive ? "ACTIF" : "INACTIF"}</span></Link>) : <p className="p-8 text-muted">Aucun client ne correspond à la recherche.</p>}</section>
    <section id="nouveau-client" className="mt-14"><h2 className="text-2xl font-bold">Créer un client</h2><ClientCreateForm /></section>
  </main>;
}
