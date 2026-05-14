-- Таблица управляемых заданий «Добрые дела»
CREATE TABLE "GoodDeedTask" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "difficulty" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "reward" INTEGER NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE INDEX "GoodDeedTask_difficulty_idx" ON "GoodDeedTask"("difficulty");
CREATE INDEX "GoodDeedTask_isActive_idx" ON "GoodDeedTask"("isActive");
CREATE INDEX "GoodDeedTask_sortOrder_idx" ON "GoodDeedTask"("sortOrder");

-- Состояние ротации заданий (singleton)
CREATE TABLE "GoodDeedTaskRotationState" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "version" INTEGER NOT NULL DEFAULT 0,
  "nextRotationAt" DATETIME NOT NULL,
  "lastRotatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
