import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/login-form";
import { authOptions } from "@/lib/auth/options";
import { dashboardForRole } from "@/lib/auth/roles";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect(dashboardForRole(session.user.role));

  return <main className="grid min-h-screen place-items-center bg-graphite p-6 text-white"><section className="w-full max-w-md rounded-2xl border border-white/10 bg-graphite-secondary p-8 shadow-2xl shadow-black/30"><p className="text-sm font-semibold tracking-[0.2em] text-electric-mint">DIGIT AGENCY</p><h1 className="mt-3 text-3xl font-bold">Connexion</h1><p className="mt-3 text-sm text-muted">Accédez à votre espace privé.</p><LoginForm /></section></main>;
}
