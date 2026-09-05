export function ownsNotification(userId:string,recipientId:string){return userId===recipientId}
export function isSafeNotificationLink(link:string|undefined){return !link||link.startsWith("/client/")||link.startsWith("/admin/")}
