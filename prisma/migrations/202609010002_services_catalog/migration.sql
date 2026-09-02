CREATE TYPE "ServicePriceType" AS ENUM ('FIXED', 'STARTING_AT', 'QUOTE');

CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "basePrice" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "priceType" "ServicePriceType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE INDEX "Service_isActive_idx" ON "Service"("isActive");
CREATE INDEX "Service_isFeatured_idx" ON "Service"("isFeatured");
CREATE INDEX "Service_displayOrder_createdAt_idx" ON "Service"("displayOrder", "createdAt");
