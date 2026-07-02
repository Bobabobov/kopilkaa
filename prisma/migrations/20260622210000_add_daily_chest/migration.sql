-- CreateTable
CREATE TABLE "DailyChestState" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "lastClaimDate" TEXT,
    "lastClaimAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyChestState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyChestClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "claimDate" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyChestClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DailyChestClaim_userId_idx" ON "DailyChestClaim"("userId");

-- CreateIndex
CREATE INDEX "DailyChestClaim_createdAt_idx" ON "DailyChestClaim"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyChestClaim_userId_claimDate_key" ON "DailyChestClaim"("userId", "claimDate");
