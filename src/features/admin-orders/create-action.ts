"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { createAdminOrderSchema } from "./create-validation";
import { createOrderByAdmin } from "./create-operation";
import { AdminOrderOperationError } from "./operations";
import type { AdminOrderActionState } from "./types";

export async function createAdminOrder(_:AdminOrderActionState,formData:FormData):Promise<AdminOrderActionState>{const admin=await requireAdmin();const parsed=createAdminOrderSchema.safeParse(Object.fromEntries(formData.entries()));if(!parsed.success)return{status:"error",message:parsed.error.issues[0]?.message??"Informations invalides."};let order;try{order=await createOrderByAdmin(admin.id,parsed.data)}catch(error){return{status:"error",message:error instanceof AdminOrderOperationError?error.message:"La commande n’a pas pu être créée."}}revalidatePath("/admin/orders");revalidatePath("/client/orders");redirect(`/admin/orders/${order.id}?created=1`)}
