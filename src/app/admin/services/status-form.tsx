"use client";

import { useActionState } from "react";
import { toggleServiceStatus } from "@/features/services/actions";
import { initialServiceActionState } from "@/features/services/types";

export function ServiceStatusForm({ id, isActive }: { id: string; isActive: boolean }) {
  const [state, action, pending] = useActionState(toggleServiceStatus, initialServiceActionState);
  return <form action={action} onSubmit={event => { if (isActive && !window.confirm("Confirmer la désactivation de ce service ?")) event.preventDefault(); }} className="mt-5">
    <input type="hidden" name="id" value={id}/><input type="hidden" name="isActive" value={String(!isActive)}/>
    <button disabled={pending} className={`rounded-xl px-4 py-2 font-semibold ${isActive ? "border border-red-300/40 text-red-200" : "bg-electric-mint text-graphite"}`}>{pending ? "Mise à jour…" : isActive ? "Désactiver le service" : "Activer le service"}</button>
    {state.status !== "idle" && <p className={state.status === "success" ? "mt-2 text-sm text-electric-mint" : "mt-2 text-sm text-red-300"}>{state.message}</p>}
  </form>;
}
