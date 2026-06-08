-- AlterTable
ALTER TABLE "StoryComment" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "StoryComment_parentId_idx" ON "StoryComment"("parentId");
