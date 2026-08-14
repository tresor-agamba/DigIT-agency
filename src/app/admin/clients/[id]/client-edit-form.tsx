"use client";

import { useActionState } from "react";
import { updateClient } from "@/features/clients/actions";
import { initialClientActionState } from "@/features/clients/types";

type Props = { client: { id: string; name: string; phone: string; isActive: boolean } };

export function ClientEditForm({ client }: Props) {
  const [state, action, pending] = useActionState(updateClient, initialClientActionState);
  return <form action={action} onSubmit={(event) => { const active = new FormData(event.currentTarget).get("isActive") === "true"; if (client.isActive && !active && !window.confirm("Voulez-vous vraiment désactiver ce compte ?")) event.preventDefault(); }} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-graphite-secondary p-6 md:grid-cols-2">
    <input type="hidden" name="id" value={client.id} />
    <label className="text-sm font-medium">Nom complet<input required name="name" defaultValue={client.name} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    <label className="text-sm font-medium">Numéro de téléphone<input required name="phone" type="tel" defaultValue={client.phone} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    <label className="flex items-center gap-3 text-sm font-medium md:col-span-2"><input name="isActive" type="checkbox" value="true" defaultChecked={client.isActive} className="size-4 accent-[#00E5B8]" />Compte actif</label>
    {state.status !== "idle" && <p role="status" className={`md:col-span-2 text-sm ${state.status === "success" ? "text-electric-mint" : "text-red-300"}`}>{state.message}</p>}
    <button disabled={pending} className="w-fit rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer les modifications"}</button>
  </form>;
}
