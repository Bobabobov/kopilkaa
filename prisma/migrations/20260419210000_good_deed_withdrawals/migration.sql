-- CreateTable
CREATE TABLE "GoodDeedWithdrawalRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amountBonuses" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminComment" TEXT,
    "reviewedAt" DATETIME,
    "reviewedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GoodDeedWithdrawalRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GoodDeedWithdrawalRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GoodDeedWithdrawalRequest_userId_idx" ON "GoodDeedWithdrawalRequest"("userId");

-- CreateIndex
CREATE INDEX "GoodDeedWithdrawalRequest_status_idx" ON "GoodDeedWithdrawalRequest"("status");

-- CreateIndex
CREATE INDEX "GoodDeedWithdrawalRequest_createdAt_idx" ON "GoodDeedWithdrawalRequest"("createdAt");
