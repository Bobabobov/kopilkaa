-- Add User.trustDelta
ALTER TABLE "User" ADD COLUMN "trustDelta" INTEGER NOT NULL DEFAULT 0;

-- Add Application.countTowardsTrust
ALTER TABLE "Application" ADD COLUMN "countTowardsTrust" BOOLEAN NOT NULL DEFAULT true;
