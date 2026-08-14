import { requireClient } from "@/lib/auth/guards";
import { ClientNavigation } from "@/app/client/client-navigation";

export default async function ClientLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireClient();
  return <><ClientNavigation />{children}</>;
}
