-- Добавляем динамические ежедневные квесты и лимит рероллов.
ALTER TABLE "UserDailyQuests" ADD COLUMN "questDayKey" TEXT;
ALTER TABLE "UserDailyQuests" ADD COLUMN "rerollsUsed" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest1_type" TEXT;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest1_target" INTEGER;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest2_type" TEXT;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest2_target" INTEGER;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest3_type" TEXT;
ALTER TABLE "UserDailyQuests" ADD COLUMN "quest3_target" INTEGER;
