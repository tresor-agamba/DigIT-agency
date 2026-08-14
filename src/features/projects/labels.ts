export const projectTypeLabels = { SITE_WEB: "Site web", MOBILE_APP: "Application mobile", AD_VIDEO: "Vidéo publicitaire" } as const;
export const projectStatusLabels = { DRAFT: "Brouillon", IN_PROGRESS: "En cours", REVIEW: "En review", CHANGES_REQUESTED: "Modifications demandées", APPROVED: "Approuvé", PAYMENT_PENDING: "Paiement en attente", READY_FOR_DELIVERY: "Prêt à livrer", DELIVERED: "Livré" } as const;

export function statusClass(status: keyof typeof projectStatusLabels) {
  if (status === "DELIVERED" || status === "APPROVED") return "bg-electric-mint/15 text-electric-mint";
  if (status === "IN_PROGRESS" || status === "REVIEW") return "bg-blue-400/15 text-blue-200";
  if (status === "CHANGES_REQUESTED" || status === "PAYMENT_PENDING") return "bg-amber-300/15 text-amber-200";
  return "bg-white/10 text-muted";
}
