-- CreateTable
CREATE TABLE "AdRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,
    "format" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "bannerUrl" TEXT,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminComment" TEXT,
    "processedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "AdRequest_status_idx" ON "AdRequest"("status");

-- CreateIndex
CREATE INDEX "AdRequest_createdAt_idx" ON "AdRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AdRequest_email_idx" ON "AdRequest"("email");
