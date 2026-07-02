-- Добавление полей экономики заявок и журнала бонусных операций

-- AlterTable
ALTER TABLE "Application" ADD COLUMN "isFirstFree" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Application" ADD COLUMN "submitBonusCost" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Application" ADD COLUMN "userLevelAtSubmit" INTEGER;

-- CreateTable
CREATE TABLE "BonusTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applicationId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BonusTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "BonusTransaction_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BonusTransaction_userId_idx" ON "BonusTransaction"("userId");
CREATE INDEX "BonusTransaction_applicationId_idx" ON "BonusTransaction"("applicationId");
CREATE INDEX "BonusTransaction_type_idx" ON "BonusTransaction"("type");
CREATE INDEX "BonusTransaction_createdAt_idx" ON "BonusTransaction"("createdAt");
