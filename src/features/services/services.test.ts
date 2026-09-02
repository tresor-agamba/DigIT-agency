import assert from "node:assert/strict";
import test from "node:test";
import { serviceSchema } from "./validation";
import { slugCandidate, slugifyServiceName } from "./slug";

const valid = { name: "Création de site web", category: "Web", shortDescription: "Un site professionnel.", description: "Une description détaillée.", priceType: "FIXED", basePrice: "500", currency: "usd", imageUrl: "https://example.com/service.jpg", displayOrder: "0", isActive: true, isFeatured: false };

test("génère un slug normalisé et des suffixes uniques", () => {
  const base = slugifyServiceName("Création de site web");
  assert.equal(base, "creation-de-site-web");
  assert.equal(slugCandidate(base, 1), "creation-de-site-web");
  assert.equal(slugCandidate(base, 2), "creation-de-site-web-2");
  assert.equal(slugCandidate(base, 3), "creation-de-site-web-3");
});

test("QUOTE accepte un prix absent", () => {
  assert.equal(serviceSchema.safeParse({ ...valid, priceType: "QUOTE", basePrice: "" }).success, true);
});

test("FIXED et STARTING_AT exigent un prix valide", () => {
  assert.equal(serviceSchema.safeParse({ ...valid, priceType: "FIXED", basePrice: "" }).success, false);
  assert.equal(serviceSchema.safeParse({ ...valid, priceType: "STARTING_AT", basePrice: "" }).success, false);
  assert.equal(serviceSchema.safeParse({ ...valid, priceType: "FIXED", basePrice: "0" }).success, true);
  assert.equal(serviceSchema.safeParse({ ...valid, priceType: "STARTING_AT", basePrice: "100" }).success, true);
});

test("refuse un ordre négatif et une URL invalide", () => {
  assert.equal(serviceSchema.safeParse({ ...valid, displayOrder: "-1" }).success, false);
  assert.equal(serviceSchema.safeParse({ ...valid, imageUrl: "pas-une-url" }).success, false);
  assert.equal(serviceSchema.safeParse({ ...valid, imageUrl: "" }).success, true);
});
