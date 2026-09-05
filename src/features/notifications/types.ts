import type{NotificationType}from"@prisma/client";
export type NotificationInput={recipientId:string;type:NotificationType;title:string;message:string;link?:string;dedupeKey?:string};
export type NotificationActionState={status:"idle"|"success"|"error";message?:string};
export const initialNotificationActionState:NotificationActionState={status:"idle"};
