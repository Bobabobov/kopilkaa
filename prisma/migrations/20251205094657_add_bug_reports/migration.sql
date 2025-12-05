-- CreateTable
CREATE TABLE "BugReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'MODERATOR',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "adminComment" TEXT,
    "processedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BugReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BugReportImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bugReportId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "BugReportImage_bugReportId_fkey" FOREIGN KEY ("bugReportId") REFERENCES "BugReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BugReportLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bugReportId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BugReportLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BugReportLike_bugReportId_fkey" FOREIGN KEY ("bugReportId") REFERENCES "BugReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BugReport_userId_idx" ON "BugReport"("userId");

-- CreateIndex
CREATE INDEX "BugReport_status_idx" ON "BugReport"("status");

-- CreateIndex
CREATE INDEX "BugReport_category_idx" ON "BugReport"("category");

-- CreateIndex
CREATE INDEX "BugReport_createdAt_idx" ON "BugReport"("createdAt");

-- CreateIndex
CREATE INDEX "BugReportImage_bugReportId_idx" ON "BugReportImage"("bugReportId");

-- CreateIndex
CREATE INDEX "BugReportImage_sort_idx" ON "BugReportImage"("sort");

-- CreateIndex
CREATE INDEX "BugReportLike_userId_idx" ON "BugReportLike"("userId");

-- CreateIndex
CREATE INDEX "BugReportLike_bugReportId_idx" ON "BugReportLike"("bugReportId");

-- CreateIndex
CREATE INDEX "BugReportLike_isLike_idx" ON "BugReportLike"("isLike");

-- CreateIndex
CREATE UNIQUE INDEX "BugReportLike_userId_bugReportId_key" ON "BugReportLike"("userId", "bugReportId");
