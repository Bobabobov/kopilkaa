-- Безопасный SQL скрипт для добавления таблицы GameScore
-- Этот скрипт ТОЛЬКО создает новую таблицу и НЕ трогает существующие данные
-- Можно выполнить вручную через SQLite CLI или через Prisma Studio

-- Создаем таблицу GameScore (только если её еще нет)
CREATE TABLE IF NOT EXISTS "GameScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gameKey" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Создаем индексы (только если их еще нет)
CREATE INDEX IF NOT EXISTS "GameScore_gameKey_idx" ON "GameScore"("gameKey");
CREATE INDEX IF NOT EXISTS "GameScore_weekKey_idx" ON "GameScore"("weekKey");
CREATE INDEX IF NOT EXISTS "GameScore_userId_idx" ON "GameScore"("userId");
CREATE INDEX IF NOT EXISTS "GameScore_score_idx" ON "GameScore"("score");
CREATE INDEX IF NOT EXISTS "GameScore_createdAt_idx" ON "GameScore"("createdAt");
CREATE INDEX IF NOT EXISTS "GameScore_gameKey_weekKey_score_idx" ON "GameScore"("gameKey", "weekKey", "score");
