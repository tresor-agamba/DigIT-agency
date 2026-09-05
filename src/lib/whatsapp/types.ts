import type{TransactionalWhatsAppType}from"@prisma/client";
export type WhatsAppPayload={title:string;message:string;link?:string};
export type WhatsAppMessage={to:string;type:TransactionalWhatsAppType;templateName:string;language:string;parameters:string[]};
export type WhatsAppProviderResult={messageId?:string};
export interface WhatsAppProvider{sendMessage(message:WhatsAppMessage):Promise<WhatsAppProviderResult>}
export type ClaimedWhatsApp={id:string;toPhone:string;type:TransactionalWhatsAppType;templateName:string|null;templateLanguage:string|null;payload:unknown;attempts:number;maxAttempts:number};
