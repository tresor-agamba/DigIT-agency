CREATE TYPE "DeliverableFinalKind" AS ENUM ('FILE', 'EXTERNAL_URL');
CREATE TYPE "ProjectDeliveryAuditAction" AS ENUM ('FINAL_ASSET_ADDED', 'FINAL_ASSET_REPLACED', 'PROJECT_DELIVERED');

ALTER TABLE "Deliverable"
ADD COLUMN "finalKind" "DeliverableFinalKind",
ADD COLUMN "finalStorageKey" TEXT,
ADD COLUMN "finalUrl" TEXT,
ADD COLUMN "finalMimeType" TEXT,
ADD COLUMN "finalFileName" TEXT,
ADD COLUMN "finalFileSize" INTEGER,
ADD COLUMN "finalUploadedAt" TIMESTAMP(3);

CREATE TABLE "ProjectDeliveryAuditLog" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" "ProjectDeliveryAuditAction" NOT NULL,
  "deliverableId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProjectDeliveryAuditLog_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ProjectDeliveryAuditLog_projectId_createdAt_idx" ON "ProjectDeliveryAuditLog"("projectId", "createdAt");
CREATE INDEX "ProjectDeliveryAuditLog_actorId_idx" ON "ProjectDeliveryAuditLog"("actorId");
ALTER TABLE "ProjectDeliveryAuditLog" ADD CONSTRAINT "ProjectDeliveryAuditLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectDeliveryAuditLog" ADD CONSTRAINT "ProjectDeliveryAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
