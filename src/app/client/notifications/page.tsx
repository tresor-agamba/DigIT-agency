import { requireClient } from "@/lib/auth/guards";
import { getNotifications } from "@/features/notifications/queries";
import { NotificationsList } from "@/app/notifications-list";
export default async function Page(){const user=await requireClient();const items=await getNotifications(user.id);return <main className="mx-auto max-w-5xl px-5 py-10 lg:px-8"><p className="text-xs font-bold tracking-[.16em] text-teal-600">CENTRE</p><h1 className="mt-2 text-3xl font-black text-slate-950">Notifications</h1><p className="mt-2 text-slate-600">Suivez les événements importants de vos commandes et projets.</p><div className="mt-7"><NotificationsList items={items} variant="light"/></div></main>}
