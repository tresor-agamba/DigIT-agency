import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const totalClients = await prisma.user.count({ where: { role: "CLIENT" } });
  return <main className="mx-auto max-w-6xl px-6 py-12 text-white"><p className="text-sm font-semibold tracking-[0.18em] text-electric-mint">ADMINISTRATION</p><h1 className="mt-3 text-4xl font-bold">Tableau de bord</h1><section className="mt-10 max-w-sm rounded-2xl border border-white/10 bg-graphite-secondary p-6"><p className="text-sm text-muted">Clients enregistrés</p><p className="mt-2 text-4xl font-bold">{totalClients}</p><Link href="/admin/clients" className="mt-6 inline-block text-sm font-semibold text-electric-mint">Gérer les clients →</Link></section></main>;
}
