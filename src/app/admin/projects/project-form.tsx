"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject, updateProject } from "@/features/projects/actions";
import { projectStatusLabels, projectTypeLabels } from "@/features/projects/labels";
import { initialProjectActionState } from "@/features/projects/types";

type ClientOption = { id: string; name: string; phone: string; isActive: boolean };
type ProjectValues = { id?: string; clientId?: string; name?: string; description?: string | null; type?: keyof typeof projectTypeLabels; status?: keyof typeof projectStatusLabels };

export function ProjectForm({ clients, project }: { clients: ClientOption[]; project?: ProjectValues }) {
  const router = useRouter();
  const [state, action, pending] = useActionState(project ? updateProject : createProject, initialProjectActionState);
  useEffect(() => { if (state.status === "success" && state.id && !project) router.push(`/admin/projects/${state.id}`); }, [state, router, project]);

  return <form action={action} className="mt-8 grid gap-5 rounded-2xl border border-white/10 bg-graphite-secondary p-6">
    {project?.id && <input type="hidden" name="id" value={project.id} />}
    <label className="text-sm font-medium">Client<select required name="clientId" defaultValue={project?.clientId ?? ""} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint"><option value="" disabled>Sélectionner un client</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} — {client.phone}{client.isActive ? "" : " (inactif)"}</option>)}</select></label>
    <label className="text-sm font-medium">Nom du projet<input required name="name" defaultValue={project?.name ?? ""} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    <div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-medium">Type<select name="type" defaultValue={project?.type ?? "SITE_WEB"} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint">{Object.entries(projectTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-medium">Statut<select name="status" defaultValue={project?.status ?? "DRAFT"} className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint">{Object.entries(projectStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
    <label className="text-sm font-medium">Description<textarea name="description" defaultValue={project?.description ?? ""} rows={5} className="mt-2 w-full resize-y rounded-xl border border-white/15 bg-graphite px-4 py-3 outline-none focus:border-electric-mint" /></label>
    {state.status !== "idle" && <p role="status" className={state.status === "success" ? "text-sm text-electric-mint" : "text-sm text-red-300"}>{state.message}</p>}
    <button disabled={pending} className="w-fit rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite disabled:opacity-60">{pending ? "Enregistrement…" : project ? "Enregistrer les modifications" : "Créer le projet"}</button>
  </form>;
}
