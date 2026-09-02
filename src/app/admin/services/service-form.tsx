"use client";

import { useActionState } from "react";
import type { ProjectType, ServicePriceType } from "@prisma/client";
import { createService, updateService } from "@/features/services/actions";
import { initialServiceActionState } from "@/features/services/types";
import { servicePriceTypeLabels } from "@/features/services/labels";
import { projectTypeLabels } from "@/features/projects/labels";

type Values = { id?: string; name?: string; category?: string; shortDescription?: string; description?: string; projectType?: ProjectType; priceType?: ServicePriceType; basePrice?: string | null; currency?: string; imageUrl?: string | null; displayOrder?: number; isActive?: boolean; isFeatured?: boolean };

export function ServiceForm({ service }: { service?: Values }) {
  const [state, action, pending] = useActionState(service?.id ? updateService : createService, initialServiceActionState);
  return <form action={action} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-graphite-secondary p-6 md:grid-cols-2">
    {service?.id && <input type="hidden" name="id" value={service.id}/>} 
    <label className="text-sm font-medium">Nom du service *<input required name="name" defaultValue={service?.name} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium">Catégorie *<input required name="category" defaultValue={service?.category} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium md:col-span-2">Description courte *<input required maxLength={240} name="shortDescription" defaultValue={service?.shortDescription} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium md:col-span-2">Description détaillée *<textarea required rows={7} name="description" defaultValue={service?.description} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium">Type de prix *<select required name="priceType" defaultValue={service?.priceType ?? "FIXED"} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3">{Object.entries(servicePriceTypeLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    <label className="text-sm font-medium">Type de projet produit *<select required name="projectType" defaultValue={service?.projectType ?? "OTHER"} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3">{Object.entries(projectTypeLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
    <label className="text-sm font-medium">Prix de base<input min="0" step="0.01" type="number" name="basePrice" defaultValue={service?.basePrice ?? ""} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/><small className="mt-1 block text-muted">Facultatif uniquement pour « Sur devis ».</small></label>
    <label className="text-sm font-medium">Devise *<input required maxLength={3} name="currency" defaultValue={service?.currency ?? "USD"} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 uppercase outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium">Ordre d’affichage *<input required min="0" step="1" type="number" name="displayOrder" defaultValue={service?.displayOrder ?? 0} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <label className="text-sm font-medium md:col-span-2">URL de l’image<input type="url" name="imageUrl" defaultValue={service?.imageUrl ?? ""} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"/></label>
    <div className="flex flex-wrap gap-6 md:col-span-2"><label className="flex items-center gap-3"><input type="checkbox" name="isActive" value="true" defaultChecked={service?.isActive ?? true}/><input type="hidden" name="isActive" value="false"/>Actif</label><label className="flex items-center gap-3"><input type="checkbox" name="isFeatured" value="true" defaultChecked={service?.isFeatured ?? false}/><input type="hidden" name="isFeatured" value="false"/>Mis en avant</label></div>
    {state.status !== "idle" && <p role="status" className={`md:col-span-2 text-sm ${state.status === "success" ? "text-electric-mint" : "text-red-300"}`}>{state.message}{state.id && !service?.id ? <> <a className="underline" href={`/admin/services/${state.id}`}>Ouvrir le service</a></> : null}</p>}
    <button disabled={pending} className="w-fit rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite disabled:opacity-60">{pending ? "Enregistrement…" : service?.id ? "Enregistrer les modifications" : "Créer le service"}</button>
  </form>;
}
