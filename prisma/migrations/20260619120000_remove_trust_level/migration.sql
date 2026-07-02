-- Удаление системы уровня доверия
ALTER TABLE "Application" DROP COLUMN "countTowardsTrust";
ALTER TABLE "Application" DROP COLUMN "trustDecreasedAtDecision";
ALTER TABLE "User" DROP COLUMN "trustDelta";
