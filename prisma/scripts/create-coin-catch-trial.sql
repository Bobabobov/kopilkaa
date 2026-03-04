-- Ручное создание таблицы CoinCatchTrial (если migrate deploy не применил миграцию).
-- Запуск: sqlite3 prisma/dev.db < prisma/scripts/create-coin-catch-trial.sql
-- Или в PowerShell: Get-Content prisma/scripts/create-coin-catch-trial.sql | sqlite3 prisma/dev.db

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

CREATE UNIQUE INDEX IF NOT EXISTS "CoinCatchTrial_userId_key" ON "CoinCatchTrial"("userId");
CREATE INDEX IF NOT EXISTS "CoinCatchTrial_userId_idx" ON "CoinCatchTrial"("userId");
CREATE INDEX IF NOT EXISTS "CoinCatchTrial_bannedUntil_idx" ON "CoinCatchTrial"("bannedUntil");
