ALTER TABLE "Service" ADD COLUMN "projectType" "ProjectType" NOT NULL DEFAULT 'OTHER';
ALTER TABLE "Project" ADD COLUMN "orderId" TEXT;
CREATE UNIQUE INDEX "Project_orderId_key" ON "Project"("orderId");
ALTER TABLE "Project" ADD CONSTRAINT "Project_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
