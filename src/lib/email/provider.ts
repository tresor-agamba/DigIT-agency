import type{EmailProvider}from"./types";
export class ConsoleEmailProvider implements EmailProvider{async sendEmail(message:Parameters<EmailProvider["sendEmail"]>[0]){const id=`console-${Date.now()}-${Math.random().toString(36).slice(2)}`;console.info(`[email:console] accepted ${id} to=${message.to} subject=${message.subject}`);return{messageId:id}}}
export function getEmailProvider():EmailProvider{const provider=(process.env.EMAIL_PROVIDER??"console").toLowerCase();if(provider!=="console")throw new Error(`EMAIL_PROVIDER non supporté: ${provider}`);return new ConsoleEmailProvider()}
