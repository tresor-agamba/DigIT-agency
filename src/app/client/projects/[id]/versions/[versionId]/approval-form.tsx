"use client";

import { useActionState, useState } from "react";
import { approveVersion } from "@/features/version-approvals/actions";
import { initialApprovalActionState } from "@/features/version-approvals/types";

export function ApprovalForm({ projectId, versionId }: { projectId: string; versionId: string }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(approveVersion, initialApprovalActionState);

  return <div className="mt-5">
    <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-electric-mint px-5 py-3 font-semibold text-graphite">Approuver cette version</button>
    {state.status === "error" && <p className="mt-3 text-sm text-red-300" role="alert">{state.message}</p>}
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-5" role="dialog" aria-modal="true" aria-labelledby="approval-title">
      <form action={action} className="w-full max-w-lg rounded-2xl border border-white/10 bg-graphite-secondary p-6 shadow-2xl">
        <input type="hidden" name="projectId" value={projectId}/><input type="hidden" name="versionId" value={versionId}/>
        <h2 id="approval-title" className="text-xl font-bold">Confirmer l’approbation</h2>
        <p className="mt-3 text-muted">Vous confirmez que cette version correspond à vos attentes et que vous souhaitez l’approuver ?</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" disabled={pending} onClick={() => setOpen(false)} className="rounded-lg border border-white/20 px-4 py-2">Annuler</button>
          <button type="submit" disabled={pending} className="rounded-lg bg-electric-mint px-4 py-2 font-semibold text-graphite disabled:opacity-60">{pending ? "Approbation…" : "Confirmer l’approbation"}</button>
        </div>
      </form>
    </div>}
  </div>;
}
