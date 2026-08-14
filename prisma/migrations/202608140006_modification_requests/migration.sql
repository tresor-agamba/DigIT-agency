CREATE TYPE "ModificationRequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

CREATE TABLE "ModificationRequest" (
  "id" TEXT NOT NULL,
  "versionId" TEXT NOT NULL,
  "clientId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ModificationRequestStatus" NOT NULL DEFAULT 'PENDING',
  "adminResponse" TEXT,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ModificationRequest_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "ModificationRequest_versionId_idx" ON "ModificationRequest"("versionId");
CREATE INDEX "ModificationRequest_clientId_idx" ON "ModificationRequest"("clientId");
CREATE INDEX "ModificationRequest_status_idx" ON "ModificationRequest"("status");
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ProjectVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
