-- CreateTable
CREATE TABLE "GoodDeedSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "reviewedById" TEXT,
    "taskKey" TEXT NOT NULL,
    "taskTitle" TEXT NOT NULL,
    "taskDescription" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "reward" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminComment" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GoodDeedSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GoodDeedSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GoodDeedSubmissionMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "GoodDeedSubmissionMedia_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "GoodDeedSubmission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GoodDeedSubmission_userId_weekKey_taskKey_key" ON "GoodDeedSubmission"("userId", "weekKey", "taskKey");

-- CreateIndex
CREATE INDEX "GoodDeedSubmission_status_idx" ON "GoodDeedSubmission"("status");

-- CreateIndex
CREATE INDEX "GoodDeedSubmission_weekKey_idx" ON "GoodDeedSubmission"("weekKey");

-- CreateIndex
CREATE INDEX "GoodDeedSubmission_createdAt_idx" ON "GoodDeedSubmission"("createdAt");

-- CreateIndex
CREATE INDEX "GoodDeedSubmissionMedia_submissionId_idx" ON "GoodDeedSubmissionMedia"("submissionId");

-- CreateIndex
CREATE INDEX "GoodDeedSubmissionMedia_sort_idx" ON "GoodDeedSubmissionMedia"("sort");
