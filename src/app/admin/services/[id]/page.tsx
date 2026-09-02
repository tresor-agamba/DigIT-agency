import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ServiceForm } from "../service-form";
import { ServiceStatusForm } from "../status-form";

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) notFound();
  return <main className="mx-auto max-w-4xl px-6 py-12 text-white"><Link href="/admin/services" className="text-sm text-electric-mint">← Services</Link><div className="mt-7 flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm font-semibold tracking-[.18em] text-electric-mint">SERVICE</p><h1 className="mt-3 text-4xl font-bold">{service.name}</h1><p className="mt-2 text-muted">Slug : <code className="text-white">{service.slug}</code></p><p className="mt-1 text-sm text-muted">Créé le {service.createdAt.toLocaleString("fr-FR")} · Modifié le {service.updatedAt.toLocaleString("fr-FR")}</p></div><ServiceStatusForm id={service.id} isActive={service.isActive}/></div><ServiceForm service={{...service,basePrice:service.basePrice?.toString()??null}}/></main>;
}
