-- CreateTable: тестовые попытки и бан для coin-catch (3 теста, 1 зачётная игра, бан на неделю)
CREATE TABLE IF NOT EXISTS "CoinCatchTrial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "testAttemptsUsed" INTEGER NOT NULL DEFAULT 0,
    "realGamePlayedAt" DATETIME,
    "bannedUntil" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CoinCatchTrial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "CoinCatchTrial_userId_key" ON "CoinCatchTrial"("userId");
CREATE INDEX "CoinCatchTrial_userId_idx" ON "CoinCatchTrial"("userId");
CREATE INDEX "CoinCatchTrial_bannedUntil_idx" ON "CoinCatchTrial"("bannedUntil");
