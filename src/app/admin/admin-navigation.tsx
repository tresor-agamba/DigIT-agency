import Link from "next/link";
import { AdminSignOutButton } from "@/components/admin-sign-out-button";

export function AdminNavigation() {
  return <header className="border-b border-white/10 bg-graphite-secondary"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5"><Link href="/admin" className="font-bold tracking-wide text-electric-mint">DIGIT AGENCY</Link><div className="flex items-center gap-5"><Link href="/admin" className="text-sm text-muted transition hover:text-white">Tableau de bord</Link><Link href="/admin/clients" className="text-sm text-muted transition hover:text-white">Clients</Link><AdminSignOutButton /></div></nav></header>;
}
