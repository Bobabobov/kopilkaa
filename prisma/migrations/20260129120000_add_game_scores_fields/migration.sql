-- AlterTable: Update GameScore table structure
-- First, check if columns exist and add them if needed

-- Add gameKey column if it doesn't exist
-- Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN directly
-- We'll use a workaround by trying to add and ignoring errors if column exists

-- For SQLite, we need to recreate the table
-- First, create a backup of existing data
CREATE TABLE IF NOT EXISTS GameScore_backup AS SELECT * FROM GameScore;

-- Drop the old table
DROP TABLE IF EXISTS GameScore;

-- Create the new table with correct structure
CREATE TABLE "GameScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gameKey" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GameScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Copy data from backup, using defaults for new required fields
INSERT INTO "GameScore" ("id", "userId", "gameKey", "weekKey", "score", "displayName", "createdAt")
SELECT 
    "id",
    "userId",
    COALESCE("gameKey", 'coin-catch') as "gameKey",
    COALESCE("weekKey", strftime('%Y-W%W', 'now')) as "weekKey",
    COALESCE("score", 0) as "score",
    COALESCE("displayName", 'Игрок') as "displayName",
    COALESCE("createdAt", CURRENT_TIMESTAMP) as "createdAt"
FROM GameScore_backup;

-- Drop backup table
DROP TABLE IF EXISTS GameScore_backup;

-- Create indexes
CREATE INDEX "GameScore_gameKey_idx" ON "GameScore"("gameKey");
CREATE INDEX "GameScore_weekKey_idx" ON "GameScore"("weekKey");
CREATE INDEX "GameScore_userId_idx" ON "GameScore"("userId");
CREATE INDEX "GameScore_score_idx" ON "GameScore"("score");
CREATE INDEX "GameScore_createdAt_idx" ON "GameScore"("createdAt");
CREATE INDEX "GameScore_gameKey_weekKey_score_idx" ON "GameScore"("gameKey", "weekKey", "score");
