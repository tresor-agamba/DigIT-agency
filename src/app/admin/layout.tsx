import { requireAdmin } from "@/lib/auth/guards";
import { AdminNavigation } from "@/app/admin/admin-navigation";
import { getUnreadNotificationCount } from "@/features/notifications/queries";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user=await requireAdmin();const unread=await getUnreadNotificationCount(user.id);
  return <><AdminNavigation unread={unread}/>{children}</>;
}
