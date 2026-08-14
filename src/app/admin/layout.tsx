import { requireAdmin } from "@/lib/auth/guards";
import { AdminNavigation } from "@/app/admin/admin-navigation";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdmin();
  return <><AdminNavigation />{children}</>;
}
