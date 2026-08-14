import "next-auth";
import type { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface User { id: string; phone: string; role: UserRole; }
  interface Session { user: { id: string; phone: string; role: UserRole; name?: string | null; }; }
}

declare module "next-auth/jwt" { interface JWT { id?: string; phone?: string; role?: UserRole; } }
