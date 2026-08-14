"use client";

import { useActionState } from "react";
import { createClient } from "@/features/clients/actions";
import { initialClientActionState } from "@/features/clients/types";

export function ClientCreateForm() {
  const [state, action, pending] = useActionState(createClient, initialClientActionState);
  return <form action={action} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-graphite-secondary p-6 md:grid-cols-2">
    <label className="text-sm font-medium">Nom complet<input required name="name" className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    <label className="text-sm font-medium">Numéro de téléphone<input required name="phone" type="tel" placeholder="+243 812 345 678" className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    <label className="text-sm font-medium md:col-span-2">Mot de passe temporaire<input required name="temporaryPassword" type="password" minLength={12} autoComplete="new-password" className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    {state.status !== "idle" && <p role="status" className={`md:col-span-2 text-sm ${state.status === "success" ? "text-electric-mint" : "text-red-300"}`}>{state.message}{state.phone ? ` Identifiant de connexion : ${state.phone}` : ""}</p>}
    <button disabled={pending} className="w-fit rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite disabled:opacity-60">{pending ? "Création…" : "Créer le client"}</button>
  </form>;
}
