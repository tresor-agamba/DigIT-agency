import{getServerSession}from"next-auth";import{authOptions}from"@/lib/auth/options";import{getFinalDownloadResponse}from"@/features/final-deliverables/access";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const session=await getServerSession(authOptions);const{id}=await params;return getFinalDownloadResponse(id,session?.user?{id:session.user.id,role:session.user.role}:null)}
