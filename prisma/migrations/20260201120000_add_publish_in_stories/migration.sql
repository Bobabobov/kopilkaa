-- Add Application.publishInStories (contest winners published to /stories)
ALTER TABLE "Application" ADD COLUMN "publishInStories" BOOLEAN NOT NULL DEFAULT false;
