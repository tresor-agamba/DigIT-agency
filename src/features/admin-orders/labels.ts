import { orderStatusLabels } from "@/features/orders/labels";
export { orderStatusLabels };
export const orderSourceLabels = { WEBSITE: "Site web", WHATSAPP: "WhatsApp", ADMIN: "Admin" } as const;
export const auditActionLabels = {
  ORDER_CREATED_BY_ADMIN: "Commande créée par un Admin",
  ORDER_STATUS_CHANGED: "Statut modifié",
  ORDER_QUOTE_UPDATED: "Montant proposé modifié",
  ORDER_ADMIN_NOTES_UPDATED: "Notes internes modifiées",
  ORDER_CONVERTED_TO_PROJECT: "Commande convertie en projet",
} as const;
export function orderStatusClass(status:keyof typeof orderStatusLabels){return status==="NEW"?"bg-electric-mint/15 text-electric-mint":status==="NEEDS_INFORMATION"?"bg-amber-400/15 text-amber-200":status==="REJECTED"||status==="CANCELLED"?"bg-red-400/15 text-red-200":"bg-white/10 text-white"}
