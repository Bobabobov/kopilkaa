-- CreateTable
CREATE TABLE "DailyBonusState" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "lastClaimDate" TEXT,
    "lastClaimAt" DATETIME,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyBonusState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyBonusClaim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "claimDate" TEXT NOT NULL,
    "dailyBonus" INTEGER NOT NULL,
    "milestoneBonus" INTEGER NOT NULL DEFAULT 0,
    "streakAfter" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DailyBonusClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "DailyBonusClaim_userId_idx" ON "DailyBonusClaim"("userId");

-- CreateIndex
CREATE INDEX "DailyBonusClaim_createdAt_idx" ON "DailyBonusClaim"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DailyBonusClaim_userId_claimDate_key" ON "DailyBonusClaim"("userId", "claimDate");
