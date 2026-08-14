import { UserRole } from "@prisma/client";

export const dashboardForRole = (role: UserRole) => role === "ADMIN" ? "/admin" : "/client";

export const isAdmin = (role: UserRole) => role === "ADMIN";
