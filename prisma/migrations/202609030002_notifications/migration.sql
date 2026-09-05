CREATE TYPE "NotificationType" AS ENUM ('ORDER_CREATED','ORDER_STATUS_CHANGED','PROJECT_CREATED','PREVIEW_READY','MODIFICATION_REQUEST_CREATED','MODIFICATION_REQUEST_UPDATED','VERSION_APPROVED','PAYMENT_REQUESTED','PAYMENT_SUBMITTED','PAYMENT_APPROVED','PAYMENT_REJECTED','FINAL_READY','PROJECT_DELIVERED','ADMIN_ACTION_REQUIRED');
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "link" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP(3),
  "dedupeKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Notification_recipientId_dedupeKey_key" ON "Notification"("recipientId","dedupeKey");
CREATE INDEX "Notification_recipientId_isRead_createdAt_idx" ON "Notification"("recipientId","isRead","createdAt");
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
