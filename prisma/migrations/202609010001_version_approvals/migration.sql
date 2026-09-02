CREATE TABLE "VersionApproval" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VersionApproval_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "VersionApproval_versionId_key" ON "VersionApproval"("versionId");
CREATE INDEX "VersionApproval_clientId_idx" ON "VersionApproval"("clientId");

ALTER TABLE "VersionApproval" ADD CONSTRAINT "VersionApproval_versionId_fkey"
FOREIGN KEY ("versionId") REFERENCES "ProjectVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "VersionApproval" ADD CONSTRAINT "VersionApproval_clientId_fkey"
FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
