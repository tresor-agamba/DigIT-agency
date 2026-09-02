import { agency } from "@/config/agency";

export function whatsappUrl(message: string) {
  return `https://wa.me/${agency.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const generalWhatsAppUrl = whatsappUrl("Bonjour DigIT Agency, je souhaite obtenir des informations sur vos services.");
export function serviceWhatsAppUrl(name: string) { return whatsappUrl(`Bonjour DigIT Agency, je suis intéressé(e) par le service : ${name}.`); }
