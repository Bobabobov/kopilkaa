-- CreateTable: Safe migration - only adds new GameScore table
-- This will NOT affect existing User data or any other tables

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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "GameScore_gameKey_idx" ON "GameScore"("gameKey");
CREATE INDEX IF NOT EXISTS "GameScore_weekKey_idx" ON "GameScore"("weekKey");
CREATE INDEX IF NOT EXISTS "GameScore_userId_idx" ON "GameScore"("userId");
CREATE INDEX IF NOT EXISTS "GameScore_score_idx" ON "GameScore"("score");
CREATE INDEX IF NOT EXISTS "GameScore_createdAt_idx" ON "GameScore"("createdAt");
CREATE INDEX IF NOT EXISTS "GameScore_gameKey_weekKey_score_idx" ON "GameScore"("gameKey", "weekKey", "score");
