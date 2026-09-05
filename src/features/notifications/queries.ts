import{prisma}from"@/lib/prisma";
import type{NotificationType}from"@prisma/client";
type NotificationView={id:string;type:NotificationType;title:string;message:string;link:string|null;isRead:boolean;readAt:Date|null;createdAt:Date;recipientId?:undefined};
const fields={id:true,type:true,title:true,message:true,link:true,isRead:true,readAt:true,createdAt:true}as const;
export function getUnreadNotificationCount(recipientId:string){return prisma.notification.count({where:{recipientId,isRead:false}})}
export function getNotifications(recipientId:string,page=1,pageSize=20):Promise<NotificationView[]>{const safePage=Math.max(1,page);return prisma.notification.findMany({where:{recipientId},select:fields,orderBy:{createdAt:"desc"},skip:(safePage-1)*pageSize,take:pageSize})}
