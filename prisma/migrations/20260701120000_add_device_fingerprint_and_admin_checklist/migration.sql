-- AlterTable
ALTER TABLE "Application" ADD COLUMN "deviceFingerprint" TEXT;
ALTER TABLE "Application" ADD COLUMN "adminReviewChecklist" TEXT;

-- CreateIndex
CREATE INDEX "Application_deviceFingerprint_idx" ON "Application"("deviceFingerprint");
