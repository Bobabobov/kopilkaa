-- CreateTable
CREATE TABLE "GoodDeedWeekPreference" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekKey" TEXT NOT NULL,
    "replacedTaskKey" TEXT NOT NULL,
    "newTaskKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GoodDeedWeekPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GoodDeedWeekPreference_userId_weekKey_key" ON "GoodDeedWeekPreference"("userId", "weekKey");

-- CreateIndex
CREATE INDEX "GoodDeedWeekPreference_userId_idx" ON "GoodDeedWeekPreference"("userId");

-- CreateIndex
CREATE INDEX "GoodDeedWeekPreference_weekKey_idx" ON "GoodDeedWeekPreference"("weekKey");
