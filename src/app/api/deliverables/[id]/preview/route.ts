import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/prisma";
import { canReadPreview } from "@/features/deliverable-previews/policy";
import { createPrivatePreviewResponse } from "@/features/deliverable-previews/stream";

export const runtime="nodejs";
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){const session=await getServerSession(authOptions);if(!session?.user)return new Response("Non authentifié",{status:401});const{id}=await params;const deliverable=await prisma.deliverable.findUnique({where:{id},select:{previewKind:true,previewStorageKey:true,previewMimeType:true,version:{select:{status:true,project:{select:{clientId:true}}}}}});if(!deliverable||deliverable.previewKind!=="FILE"||!deliverable.previewStorageKey||!deliverable.previewMimeType)return new Response("Introuvable",{status:404});if(!canReadPreview(session.user.role,session.user.id,deliverable.version.project.clientId,deliverable.version.status))return new Response("Interdit",{status:403});try{return await createPrivatePreviewResponse(deliverable.previewStorageKey,deliverable.previewMimeType,request.headers.get("range"))}catch{return new Response("Introuvable",{status:404})}}
