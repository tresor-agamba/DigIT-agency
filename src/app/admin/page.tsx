import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [totalClients, totalProjects, inProgress, review, delivered] = await Promise.all([prisma.user.count({ where: { role: "CLIENT" } }), prisma.project.count(), prisma.project.count({ where: { status: "IN_PROGRESS" } }), prisma.project.count({ where: { status: "REVIEW" } }), prisma.project.count({ where: { status: "DELIVERED" } })]);
  return <main className="mx-auto max-w-6xl px-6 py-12 text-white"><p className="text-sm font-semibold tracking-[0.18em] text-electric-mint">ADMINISTRATION</p><h1 className="mt-3 text-4xl font-bold">Tableau de bord</h1><section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Clients", totalClients, "/admin/clients"], ["Projets", totalProjects, "/admin/projects"], ["En cours", inProgress, "/admin/projects?status=IN_PROGRESS"], ["En review", review, "/admin/projects?status=REVIEW"], ["Livrés", delivered, "/admin/projects?status=DELIVERED"]].map(([label, value, href]) => <Link key={String(label)} href={String(href)} className="rounded-2xl border border-white/10 bg-graphite-secondary p-5 transition hover:border-electric-mint/50"><p className="text-sm text-muted">{label}</p><p className="mt-2 text-3xl font-bold">{value}</p></Link>)}</section></main>;
}
