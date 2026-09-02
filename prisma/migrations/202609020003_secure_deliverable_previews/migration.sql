CREATE TYPE "DeliverablePreviewKind" AS ENUM ('FILE', 'EXTERNAL_URL');
ALTER TABLE "Deliverable"
  ADD COLUMN "previewKind" "DeliverablePreviewKind",
  ADD COLUMN "previewStorageKey" TEXT,
  ADD COLUMN "previewUrl" TEXT,
  ADD COLUMN "previewMimeType" TEXT,
  ADD COLUMN "previewFileName" TEXT,
  ADD COLUMN "previewFileSize" INTEGER;
