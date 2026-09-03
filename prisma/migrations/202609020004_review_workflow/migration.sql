ALTER TABLE "ModificationRequest" ADD COLUMN "resolvedVersionId" TEXT;
CREATE INDEX "ModificationRequest_resolvedVersionId_idx" ON "ModificationRequest"("resolvedVersionId");
ALTER TABLE "ModificationRequest" ADD CONSTRAINT "ModificationRequest_resolvedVersionId_fkey" FOREIGN KEY ("resolvedVersionId") REFERENCES "ProjectVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
