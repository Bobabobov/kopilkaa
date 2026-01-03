-- Add hideFromHeroes flag to User table (SQLite uses INTEGER for booleans)
ALTER TABLE "User" ADD COLUMN "hideFromHeroes" INTEGER NOT NULL DEFAULT 0;


