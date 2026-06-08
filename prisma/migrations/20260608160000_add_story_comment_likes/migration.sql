-- CreateTable
CREATE TABLE "StoryCommentLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StoryCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoryCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "StoryComment" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "StoryCommentLike_userId_commentId_key" ON "StoryCommentLike"("userId", "commentId");
CREATE INDEX "StoryCommentLike_userId_idx" ON "StoryCommentLike"("userId");
CREATE INDEX "StoryCommentLike_commentId_idx" ON "StoryCommentLike"("commentId");
CREATE INDEX "StoryCommentLike_createdAt_idx" ON "StoryCommentLike"("createdAt");
