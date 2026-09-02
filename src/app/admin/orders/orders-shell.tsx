"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
export function OrdersShell({children}:{children:React.ReactNode}){const pathname=usePathname();const params=useSearchParams();return <>{params.get("created")==="1"&&<div role="status" className="mx-auto mt-6 max-w-6xl rounded-xl border border-electric-mint/30 bg-electric-mint/10 p-4 font-semibold text-electric-mint">Commande créée avec succès.</div>}{pathname==="/admin/orders"&&<Link href="/admin/orders/new" className="fixed bottom-6 right-6 z-30 rounded-xl bg-electric-mint px-5 py-3 font-bold text-graphite shadow-xl">+ Nouvelle commande</Link>}{children}</>}
