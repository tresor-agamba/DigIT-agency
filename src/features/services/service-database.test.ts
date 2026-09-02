import assert from "node:assert/strict";
import test from "node:test";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const rollback = new Error("ROLLBACK_TEST_TRANSACTION");

test("création, modification et désactivation persistent sans suppression", async () => {
  await assert.rejects(
    prisma.$transaction(async tx => {
      const suffix = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const slug = `service-test-${suffix}`;
      const service = await tx.service.create({ data: { name: "Service test", slug, shortDescription: "Description courte", description: "Description détaillée", category: "Test", basePrice: new Prisma.Decimal(100), currency: "USD", priceType: "FIXED", displayOrder: 1 } });
      assert.equal(service.isActive, true);

      const updated = await tx.service.update({ where: { id: service.id }, data: { name: "Service modifié", isActive: false } });
      assert.equal(updated.name, "Service modifié");
      assert.equal(updated.isActive, false);
      assert.equal(await tx.service.count({ where: { id: service.id } }), 1);
      throw rollback;
    }),
    error => error === rollback,
  );
});

test.after(async () => { await prisma.$disconnect(); });
