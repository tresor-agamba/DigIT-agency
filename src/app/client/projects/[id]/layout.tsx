import Link from "next/link";
import { requireClient } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
export default async function Layout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{id:string}>}>){const client=await requireClient();const{id}=await params;const project=await prisma.project.findFirst({where:{id,clientId:client.id},select:{order:{select:{id:true,orderNumber:true}}}});return <>{project?.order&&<section className="mx-auto mt-8 max-w-5xl rounded-2xl border border-white/10 bg-graphite-secondary p-5 text-sm text-muted">Issu de la commande <Link className="text-electric-mint underline" href={`/client/orders/${project.order.id}`}>{project.order.orderNumber}</Link></section>}{children}</>}
