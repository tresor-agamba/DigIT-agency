import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "DigIT Agency", description: "Solutions digitales et technologiques pour les entreprises." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="fr"><body>{children}</body></html>; }
