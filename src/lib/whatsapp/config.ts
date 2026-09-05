const integer=(value:string|undefined,fallback:number)=>{const parsed=Number.parseInt(value??"",10);return Number.isFinite(parsed)&&parsed>0?parsed:fallback};
export const whatsappMaxAttempts=()=>integer(process.env.WHATSAPP_MAX_ATTEMPTS,5);
export const whatsappProcessingTimeoutMinutes=()=>integer(process.env.WHATSAPP_PROCESSING_TIMEOUT_MINUTES,10);
export const whatsappLanguage=()=>process.env.WHATSAPP_DEFAULT_LANGUAGE?.trim()||"fr";
export const whatsappProviderName=()=>process.env.WHATSAPP_PROVIDER?.trim().toLowerCase()||"console";
export function buildWhatsAppAppUrl(path:string){const base=process.env.WHATSAPP_APP_BASE_URL?.trim()||"http://localhost:3000";if(!path.startsWith("/")||path.startsWith("//"))throw new Error("Chemin WhatsApp invalide.");return new URL(path,base).toString()}
