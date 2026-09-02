"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { convertAcceptedOrder, OrderConversionError } from "./operation";
import { convertOrderSchema } from "./validation";
import type { ConvertOrderActionState } from "./types";
export async function convertOrderToProject(orderId:string,_:ConvertOrderActionState,formData:FormData):Promise<ConvertOrderActionState>{const admin=await requireAdmin();const parsed=convertOrderSchema.safeParse(Object.fromEntries(formData.entries()));if(!parsed.success)return{status:"error",message:parsed.error.issues[0]?.message??"Informations invalides."};let projectId:string;try{projectId=(await convertAcceptedOrder(admin.id,{...parsed.data,orderId})).id}catch(error){return{status:"error",message:error instanceof OrderConversionError?error.message:"La conversion de la commande a échoué."}}revalidatePath("/admin/orders");revalidatePath(`/admin/orders/${orderId}`);revalidatePath("/admin/projects");revalidatePath(`/admin/projects/${projectId}`);revalidatePath("/client/orders");revalidatePath("/client/projects");redirect(`/admin/projects/${projectId}?converted=1`)}
