-- CreateTable
CREATE TABLE "GoodDeedFirstFeedBonusMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "bonusBonuses" INTEGER NOT NULL DEFAULT 300,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "GoodDeedFirstFeedBonusMeta_submissionId_key" ON "GoodDeedFirstFeedBonusMeta"("submissionId");
