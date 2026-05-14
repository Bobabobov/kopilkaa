-- Реферальная программа: колонка на User + таблицы кликов и регистраций
-- (раньше поля были только в schema.prisma без миграции — на проде падал Prisma P2022)

-- AlterTable
ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- CreateTable
CREATE TABLE "ReferralClick" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerUserId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralClick_referrerUserId_fkey" FOREIGN KEY ("referrerUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ReferralClick_referrerUserId_idx" ON "ReferralClick"("referrerUserId");

-- CreateIndex
CREATE INDEX "ReferralClick_createdAt_idx" ON "ReferralClick"("createdAt");

-- CreateTable
CREATE TABLE "ReferralRegistration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "referrerUserId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bonusGrantedAt" DATETIME,
    CONSTRAINT "ReferralRegistration_referrerUserId_fkey" FOREIGN KEY ("referrerUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ReferralRegistration_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralRegistration_referredUserId_key" ON "ReferralRegistration"("referredUserId");

-- CreateIndex
CREATE INDEX "ReferralRegistration_referrerUserId_idx" ON "ReferralRegistration"("referrerUserId");
