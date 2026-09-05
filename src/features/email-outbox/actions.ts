"use server";import{requireAdmin}from"@/lib/auth/guards";import{revalidatePath}from"next/cache";import{retryFailedEmailAs}from"./operations";
export async function retryFailedEmail(f:FormData):Promise<void>{const admin=await requireAdmin();const id=f.get("emailId");if(typeof id!=="string"||!id)return;await retryFailedEmailAs(admin.id,id);revalidatePath("/admin/emails")}
