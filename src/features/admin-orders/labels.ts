import {orderStatusLabels} from "@/features/orders/labels";
export {orderStatusLabels};
export const orderSourceLabels={WEBSITE:"Site web",WHATSAPP:"WhatsApp",ADMIN:"Admin"} as const;
export const auditActionLabels={ORDER_CREATED_BY_ADMIN:"Commande créée par un Admin",ORDER_STATUS_CHANGED:"Statut modifié",ORDER_QUOTE_UPDATED:"Montant proposé modifié",ORDER_ADMIN_NOTES_UPDATED:"Notes internes modifiées",ORDER_CONVERTED_TO_PROJECT:"Commande convertie en projet"} as const;
export function orderStatusClass(status:keyof typeof orderStatusLabels){if(["ACCEPTED","CONVERTED_TO_PROJECT"].includes(status))return"bg-teal-50 text-teal-700";if(["REJECTED","CANCELLED"].includes(status))return"bg-red-50 text-red-700";if(["NEEDS_INFORMATION","QUOTED"].includes(status))return"bg-amber-50 text-amber-800";if(status==="UNDER_REVIEW")return"bg-blue-50 text-blue-700";return"bg-slate-100 text-slate-700"}
