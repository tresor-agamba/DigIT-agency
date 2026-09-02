import assert from "node:assert/strict";
import test from "node:test";
import { formatServicePrice } from "@/features/services/labels";
import { generalWhatsAppUrl, serviceWhatsAppUrl } from "@/lib/whatsapp";

test("formate correctement les trois types de prix sans convertir null en zéro", () => {
  assert.match(formatServicePrice("FIXED", { toString: () => "125" }, "USD"), /125/);
  assert.match(formatServicePrice("STARTING_AT", { toString: () => "75" }, "USD"), /^À partir de/);
  assert.equal(formatServicePrice("QUOTE", null, "USD"), "Sur devis");
  assert.equal(formatServicePrice("FIXED", null, "USD"), "—");
});

test("encode les messages WhatsApp généraux et spécifiques", () => {
  const general = new URL(generalWhatsAppUrl);
  assert.equal(general.hostname, "wa.me");
  assert.match(general.searchParams.get("text") ?? "", /informations sur vos services/);
  const specific = new URL(serviceWhatsAppUrl("Création de site web & SEO"));
  assert.match(specific.searchParams.get("text") ?? "", /Création de site web & SEO/);
});
