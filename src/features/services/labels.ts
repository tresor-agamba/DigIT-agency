export const servicePriceTypeLabels = { FIXED: "Prix fixe", STARTING_AT: "À partir de", QUOTE: "Sur devis" } as const;

export function formatServicePrice(priceType: keyof typeof servicePriceTypeLabels, basePrice: { toString(): string } | null, currency: string) {
  if (priceType === "QUOTE") return "Sur devis";
  if (!basePrice) return "—";
  const amount = new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(Number(basePrice.toString()));
  return priceType === "STARTING_AT" ? `À partir de ${amount}` : amount;
}
