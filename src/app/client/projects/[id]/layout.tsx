import Link from "next/link";
import { requireClient } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
export default async function Layout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{id:string}>}>){const client=await requireClient();const{id}=await params;const project=await prisma.project.findFirst({where:{id,clientId:client.id},select:{order:{select:{id:true,orderNumber:true}}}});return <>{project?.order&&<section className="mx-auto mt-8 max-w-7xl px-5 text-sm text-slate-600 lg:px-8"><div className="rounded-xl border border-slate-200 bg-white p-4">Issu de la commande <Link className="font-bold text-teal-700 underline" href={`/client/orders/${project.order.id}`}>{project.order.orderNumber}</Link></div></section>}{children}</>}
