-- AlterTable (filledMs added in 20260220110000_add_filled_ms; on prod it may already exist)
ALTER TABLE "Application" ADD COLUMN "storyEditMs" INTEGER;
