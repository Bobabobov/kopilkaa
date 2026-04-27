-- CreateTable
CREATE TABLE "GoodDeedBonusGrant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amountBonuses" INTEGER NOT NULL,
    "comment" TEXT,
    "grantedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoodDeedBonusGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GoodDeedBonusGrant_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "GoodDeedBonusGrant_userId_idx" ON "GoodDeedBonusGrant"("userId");

-- CreateIndex
CREATE INDEX "GoodDeedBonusGrant_grantedById_idx" ON "GoodDeedBonusGrant"("grantedById");

-- CreateIndex
CREATE INDEX "GoodDeedBonusGrant_createdAt_idx" ON "GoodDeedBonusGrant"("createdAt");
