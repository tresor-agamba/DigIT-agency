import Link from "next/link";
import { ServiceForm } from "../service-form";

export default function NewServicePage() { return <main className="mx-auto max-w-4xl px-6 py-12 text-white"><Link href="/admin/services" className="text-sm text-electric-mint">← Services</Link><p className="mt-7 text-sm font-semibold tracking-[.18em] text-electric-mint">NOUVEAU SERVICE</p><h1 className="mt-3 text-4xl font-bold">Créer un service</h1><ServiceForm/></main>; }
