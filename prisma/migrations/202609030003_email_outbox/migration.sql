CREATE TYPE "EmailOutboxStatus" AS ENUM ('PENDING','PROCESSING','SENT','FAILED');
CREATE TYPE "TransactionalEmailType" AS ENUM ('ORDER_CREATED','ORDER_QUOTED','ORDER_ACCEPTED','PROJECT_CREATED','PREVIEW_READY','MODIFICATION_REQUEST_UPDATED','PAYMENT_REQUESTED','PAYMENT_APPROVED','PAYMENT_REJECTED','PROJECT_DELIVERED','NEW_WEBSITE_ORDER','NEW_MODIFICATION_REQUEST','VERSION_APPROVED','PAYMENT_SUBMITTED');
CREATE TABLE "EmailOutbox" (
 "id" TEXT NOT NULL,"recipientUserId" TEXT,"toEmail" TEXT NOT NULL,"type" "TransactionalEmailType" NOT NULL,"status" "EmailOutboxStatus" NOT NULL DEFAULT 'PENDING',"subject" TEXT NOT NULL,"payload" JSONB NOT NULL,"dedupeKey" TEXT NOT NULL,"attempts" INTEGER NOT NULL DEFAULT 0,"maxAttempts" INTEGER NOT NULL DEFAULT 5,"nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"lastAttemptAt" TIMESTAMP(3),"processingStartedAt" TIMESTAMP(3),"sentAt" TIMESTAMP(3),"failedAt" TIMESTAMP(3),"lastError" TEXT,"providerMessageId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "EmailOutbox_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "EmailOutbox_dedupeKey_key" ON "EmailOutbox"("dedupeKey");
CREATE INDEX "EmailOutbox_status_nextAttemptAt_idx" ON "EmailOutbox"("status","nextAttemptAt");
CREATE INDEX "EmailOutbox_recipientUserId_idx" ON "EmailOutbox"("recipientUserId");
CREATE INDEX "EmailOutbox_createdAt_idx" ON "EmailOutbox"("createdAt");
ALTER TABLE "EmailOutbox" ADD CONSTRAINT "EmailOutbox_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
