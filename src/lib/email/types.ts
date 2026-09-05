import type{TransactionalEmailType}from"@prisma/client";
export type EmailMessage={to:string;subject:string;html:string;text:string};
export type EmailProviderResult={messageId?:string};
export interface EmailProvider{sendEmail(message:EmailMessage):Promise<EmailProviderResult>}
export type EmailPayload={title:string;message:string;link?:string};
export type ClaimedEmail={id:string;toEmail:string;type:TransactionalEmailType;subject:string;payload:unknown;attempts:number;maxAttempts:number};
