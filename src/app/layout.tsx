import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DigIT Agency Client Portal",
  description: "Espace privé clients de DigIT Agency",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
