import { requireClient } from "@/lib/auth/guards";

export default async function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireClient();
  return children;
}
