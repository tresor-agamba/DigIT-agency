import { requireClient } from "@/lib/auth/guards";
import { ClientNavigation } from "@/app/client/client-navigation";
import { getUnreadNotificationCount } from "@/features/notifications/queries";

export default async function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user=await requireClient();const unread=await getUnreadNotificationCount(user.id);
  return <><ClientNavigation unread={unread}/>{children}</>;
}
