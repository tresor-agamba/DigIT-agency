export const clientProjectTypeLabels = { SITE_WEB: "Site web", MOBILE_APP: "Application mobile", AD_VIDEO: "Vidéo publicitaire" } as const;
export const clientProjectStatusLabels = { DRAFT: "Brouillon", IN_PROGRESS: "En cours", REVIEW: "À examiner", CHANGES_REQUESTED: "Modifications demandées", APPROVED: "Approuvé", PAYMENT_PENDING: "Paiement en attente", READY_FOR_DELIVERY: "Prêt pour livraison", DELIVERED: "Livré" } as const;
export const clientVersionStatusLabels = { DRAFT: "Brouillon", READY_FOR_REVIEW: "À examiner", APPROVED: "Approuvée", CHANGES_REQUESTED: "Modifications demandées", FINAL: "Version finale" } as const;

export function clientStatusClass(status: keyof typeof clientProjectStatusLabels) { return status === "DELIVERED" || status === "APPROVED" ? "bg-electric-mint/15 text-electric-mint" : status === "REVIEW" || status === "IN_PROGRESS" ? "bg-blue-400/15 text-blue-200" : "bg-white/10 text-muted"; }
export function fileSizeLabel(size: number | null) { if (!size) return "Taille non renseignée"; if (size < 1024) return `${size} o`; if (size < 1024 * 1024) return `${Math.round(size / 1024)} Ko`; return `${(size / (1024 * 1024)).toFixed(1)} Mo`; }
