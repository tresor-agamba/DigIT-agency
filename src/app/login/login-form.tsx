"use client";

import { FormEvent, useState } from "react";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", { phone: String(data.get("phone") ?? ""), password: String(data.get("password") ?? ""), redirect: false });

    if (result?.error) {
      setError("Numéro de téléphone ou mot de passe incorrect.");
      setIsSubmitting(false);
      return;
    }

    const session = await getSession();
    router.replace(session?.user.role === "ADMIN" ? "/admin" : "/client");
    router.refresh();
  }

  return <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
    <label className="block text-sm font-medium">Numéro de téléphone<input required name="phone" type="tel" autoComplete="tel" placeholder="+243 812 345 678" className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 text-white outline-none transition focus:border-electric-mint" /></label>
    <label className="block text-sm font-medium">Mot de passe<input required name="password" type="password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-white/15 bg-graphite px-4 py-3 text-white outline-none transition focus:border-electric-mint" /></label>
    {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
    <button disabled={isSubmitting} className="w-full rounded-xl bg-electric-mint px-4 py-3 font-semibold text-graphite disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Connexion…" : "Se connecter"}</button>
  </form>;
}
