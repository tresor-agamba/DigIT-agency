import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-graphite px-6 py-16 text-white">
      <section className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-graphite-secondary p-8 md:p-14">
        <p className="text-sm font-semibold tracking-[0.24em] text-electric-mint">DIGIT AGENCY</p>
        <div className="space-y-4"><h1 className="text-4xl font-bold md:text-6xl">Client Portal</h1><p className="max-w-2xl text-lg text-muted">Un espace privé, simple et transparent pour suivre vos projets avec DigIT Agency.</p></div>
        <div className="flex flex-wrap gap-4"><Link href="/admin" className="rounded-xl bg-electric-mint px-5 py-3 font-semibold text-graphite">Espace administrateur</Link><Link href="/client" className="rounded-xl border border-white/20 px-5 py-3 font-semibold">Espace client</Link></div>
      </section>
    </main>
  );
}
