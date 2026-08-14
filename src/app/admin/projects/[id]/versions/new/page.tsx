import Link from "next/link";
import { notFound } from "next/navigation";
import { VersionForm } from "@/app/admin/projects/[id]/versions/version-form";
import { projectIdSchema } from "@/features/projects/validation";
import { prisma } from "@/lib/prisma";
export default async function NewVersionPage({ params }: { params: Promise<{ id: string }> }) { const parsed=projectIdSchema.safeParse((await params).id); if(!parsed.success || !await prisma.project.findUnique({where:{id:parsed.data},select:{id:true}})) notFound(); return <main className="mx-auto max-w-3xl px-6 py-12 text-white"><Link href={`/admin/projects/${parsed.data}`} className="text-sm text-electric-mint">← Projet</Link><h1 className="mt-6 text-4xl font-bold">Nouvelle version</h1><VersionForm projectId={parsed.data} /></main>; }
