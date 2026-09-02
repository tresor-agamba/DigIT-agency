CREATE TYPE "OrderAuditAction" AS ENUM ('ORDER_STATUS_CHANGED', 'ORDER_QUOTE_UPDATED', 'ORDER_ADMIN_NOTES_UPDATED');

CREATE TABLE "OrderAuditLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "OrderAuditAction" NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrderAuditLog_orderId_createdAt_idx" ON "OrderAuditLog"("orderId", "createdAt");
CREATE INDEX "OrderAuditLog_adminId_idx" ON "OrderAuditLog"("adminId");
ALTER TABLE "OrderAuditLog" ADD CONSTRAINT "OrderAuditLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderAuditLog" ADD CONSTRAINT "OrderAuditLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
