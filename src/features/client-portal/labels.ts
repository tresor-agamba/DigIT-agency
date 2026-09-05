export const clientProjectTypeLabels = {
  SITE_WEB: "Site web", MOBILE_APP: "Application mobile", AD_VIDEO: "Vidéo publicitaire", OTHER: "Autre service IT",
} as const;
export const clientProjectStatusLabels = {
  DRAFT: "Préparation", IN_PROGRESS: "En production", REVIEW: "À valider", CHANGES_REQUESTED: "Modifications demandées",
  APPROVED: "Approuvé", PAYMENT_PENDING: "Paiement en attente", READY_FOR_DELIVERY: "Prêt à livrer", DELIVERED: "Livré",
} as const;
export const clientVersionStatusLabels = {
  DRAFT: "Préparation", READY_FOR_REVIEW: "À examiner", APPROVED: "Approuvée", CHANGES_REQUESTED: "Modifications demandées", FINAL: "Version finale",
} as const;
export function clientStatusClass(status: keyof typeof clientProjectStatusLabels) {
  if (status === "DELIVERED" || status === "APPROVED") return "bg-teal-50 text-teal-700";
  if (status === "REVIEW" || status === "IN_PROGRESS") return "bg-blue-50 text-blue-700";
  return "bg-slate-100 text-slate-700";
}
export function fileSizeLabel(size: number | null) {
  if (!size) return "Taille non renseignée";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} Ko`;
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
}
