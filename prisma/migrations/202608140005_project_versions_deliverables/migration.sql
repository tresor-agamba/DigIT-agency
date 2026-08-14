ALTER TYPE "VersionStatus" RENAME VALUE 'SUBMITTED' TO 'READY_FOR_REVIEW';
ALTER TYPE "VersionStatus" ADD VALUE 'CHANGES_REQUESTED';
ALTER TYPE "VersionStatus" ADD VALUE 'FINAL';

CREATE TYPE "DeliverableType" AS ENUM ('VIDEO', 'WEBSITE', 'MOBILE_APP', 'DOCUMENT', 'ARCHIVE', 'OTHER');

ALTER TABLE "ProjectVersion" RENAME COLUMN "label" TO "name";
ALTER TABLE "ProjectVersion" RENAME COLUMN "notes" TO "description";
ALTER TABLE "ProjectVersion" ADD COLUMN "versionNumber" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "ProjectVersion" ALTER COLUMN "versionNumber" DROP DEFAULT;
CREATE UNIQUE INDEX "ProjectVersion_projectId_versionNumber_key" ON "ProjectVersion"("projectId", "versionNumber");

ALTER TABLE "Deliverable" DROP CONSTRAINT "Deliverable_projectId_fkey";
DROP INDEX "Deliverable_projectId_idx";
ALTER TABLE "Deliverable" DROP COLUMN "projectId", DROP COLUMN "isFinal", ALTER COLUMN "fileUrl" DROP NOT NULL,
  ADD COLUMN "versionId" TEXT NOT NULL,
  ADD COLUMN "type" "DeliverableType" NOT NULL DEFAULT 'OTHER',
  ADD COLUMN "description" TEXT,
  ADD COLUMN "fileName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "mimeType" TEXT,
  ADD COLUMN "fileSize" INTEGER;
ALTER TABLE "Deliverable" ALTER COLUMN "type" DROP DEFAULT, ALTER COLUMN "fileName" DROP DEFAULT;
CREATE INDEX "Deliverable_versionId_idx" ON "Deliverable"("versionId");
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ProjectVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
