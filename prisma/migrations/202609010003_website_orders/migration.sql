CREATE TYPE "OrderSource" AS ENUM ('WEBSITE', 'WHATSAPP', 'ADMIN');
CREATE TYPE "OrderStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'NEEDS_INFORMATION', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'CONVERTED_TO_PROJECT');
CREATE SEQUENCE "OrderNumberSequence" START 1;

CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "source" "OrderSource" NOT NULL DEFAULT 'WEBSITE',
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyName" TEXT,
    "budget" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "desiredDeadline" TIMESTAMP(3),
    "quotedAmount" DECIMAL(12,2),
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
CREATE INDEX "Order_clientId_createdAt_idx" ON "Order"("clientId", "createdAt");
CREATE INDEX "Order_serviceId_idx" ON "Order"("serviceId");
CREATE INDEX "Order_status_idx" ON "Order"("status");
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
