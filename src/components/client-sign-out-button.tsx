"use client";
import { signOut } from "next-auth/react";
export function ClientSignOutButton() { return <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-left text-sm text-muted transition hover:text-white">Déconnexion</button>; }
