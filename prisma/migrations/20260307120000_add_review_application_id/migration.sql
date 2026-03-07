-- Review: add applicationId (one review per application), remove unique on userId (allow multiple reviews per user)
PRAGMA foreign_keys = OFF;

CREATE TABLE "Review_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "Review_new" ("id", "userId", "content", "createdAt", "updatedAt")
SELECT "id", "userId", "content", "createdAt", "updatedAt" FROM "Review";

DROP TABLE "Review";

ALTER TABLE "Review_new" RENAME TO "Review";

CREATE UNIQUE INDEX "Review_applicationId_key" ON "Review"("applicationId");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");
CREATE INDEX "Review_applicationId_idx" ON "Review"("applicationId");
CREATE INDEX "Review_createdAt_idx" ON "Review"("createdAt");

PRAGMA foreign_keys = ON;

-- Backfill: привязать существующие отзывы к последней одобренной заявке пользователя
UPDATE "Review"
SET "applicationId" = (
    SELECT "id" FROM "Application"
    WHERE "Application"."userId" = "Review"."userId"
      AND "Application"."status" = 'APPROVED'
    ORDER BY "Application"."createdAt" DESC
    LIMIT 1
)
WHERE "applicationId" IS NULL;
