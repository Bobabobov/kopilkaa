-- Add Application.trustDecreasedAtDecision for admin micro-stats (rejected/approved with "понизить уровень")
ALTER TABLE "Application" ADD COLUMN "trustDecreasedAtDecision" BOOLEAN NOT NULL DEFAULT false;
