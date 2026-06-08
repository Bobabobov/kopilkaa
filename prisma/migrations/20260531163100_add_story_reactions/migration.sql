-- Redefine StoryLike as story reactions while keeping existing likes as HEART.
ALTER TABLE "StoryLike" ADD COLUMN "type" TEXT NOT NULL DEFAULT 'HEART';

CREATE INDEX "StoryLike_type_idx" ON "StoryLike"("type");
