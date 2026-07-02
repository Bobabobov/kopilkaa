-- CreateTable
CREATE TABLE "UserDailyQuests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quest1_done" BOOLEAN NOT NULL DEFAULT false,
    "quest2_done" BOOLEAN NOT NULL DEFAULT false,
    "quest3_done" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserDailyQuests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDailyQuests_userId_key" ON "UserDailyQuests"("userId");

-- CreateIndex
CREATE INDEX "UserDailyQuests_userId_idx" ON "UserDailyQuests"("userId");
