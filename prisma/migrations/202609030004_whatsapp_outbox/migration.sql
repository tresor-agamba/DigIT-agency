CREATE TYPE "WhatsAppOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');
CREATE TYPE "WhatsAppProviderStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');
CREATE TYPE "TransactionalWhatsAppType" AS ENUM ('ORDER_CREATED', 'ORDER_QUOTED', 'ORDER_ACCEPTED', 'PROJECT_CREATED', 'PREVIEW_READY', 'MODIFICATION_REQUEST_UPDATED', 'PAYMENT_REQUESTED', 'PAYMENT_APPROVED', 'PAYMENT_REJECTED', 'PROJECT_DELIVERED', 'NEW_WEBSITE_ORDER', 'NEW_MODIFICATION_REQUEST', 'VERSION_APPROVED', 'PAYMENT_SUBMITTED');

ALTER TABLE "User" ADD COLUMN "whatsappOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "whatsappOptInAt" TIMESTAMP(3),
ADD COLUMN "whatsappOptOutAt" TIMESTAMP(3);

CREATE TABLE "WhatsAppOutbox" (
  "id" TEXT NOT NULL,
  "recipientUserId" TEXT,
  "toPhone" TEXT NOT NULL,
  "type" "TransactionalWhatsAppType" NOT NULL,
  "status" "WhatsAppOutboxStatus" NOT NULL DEFAULT 'PENDING',
  "templateName" TEXT,
  "templateLanguage" TEXT,
  "payload" JSONB NOT NULL,
  "dedupeKey" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "maxAttempts" INTEGER NOT NULL DEFAULT 5,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processingStartedAt" TIMESTAMP(3),
  "lastAttemptAt" TIMESTAMP(3),
  "sentAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "providerMessageId" TEXT,
  "providerStatus" "WhatsAppProviderStatus",
  "deliveredAt" TIMESTAMP(3),
  "readAt" TIMESTAMP(3),
  "providerFailedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WhatsAppOutbox_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "WhatsAppOutbox_dedupeKey_key" ON "WhatsAppOutbox"("dedupeKey");
CREATE INDEX "WhatsAppOutbox_status_nextAttemptAt_idx" ON "WhatsAppOutbox"("status", "nextAttemptAt");
CREATE INDEX "WhatsAppOutbox_recipientUserId_idx" ON "WhatsAppOutbox"("recipientUserId");
CREATE INDEX "WhatsAppOutbox_providerMessageId_idx" ON "WhatsAppOutbox"("providerMessageId");
CREATE INDEX "WhatsAppOutbox_createdAt_idx" ON "WhatsAppOutbox"("createdAt");
ALTER TABLE "WhatsAppOutbox" ADD CONSTRAINT "WhatsAppOutbox_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
