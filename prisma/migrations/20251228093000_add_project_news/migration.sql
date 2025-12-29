-- CreateTable
CREATE TABLE "ProjectNewsPost" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "dislikesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectNewsPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectNewsMedia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectNewsMedia_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ProjectNewsPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectNewsReaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectNewsReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ProjectNewsPost" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectNewsReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProjectNewsPost_authorId_idx" ON "ProjectNewsPost"("authorId");

-- CreateIndex
CREATE INDEX "ProjectNewsPost_createdAt_idx" ON "ProjectNewsPost"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectNewsPost_isPublished_idx" ON "ProjectNewsPost"("isPublished");

-- CreateIndex
CREATE INDEX "ProjectNewsMedia_postId_idx" ON "ProjectNewsMedia"("postId");

-- CreateIndex
CREATE INDEX "ProjectNewsMedia_sort_idx" ON "ProjectNewsMedia"("sort");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectNewsReaction_postId_userId_key" ON "ProjectNewsReaction"("postId", "userId");

-- CreateIndex
CREATE INDEX "ProjectNewsReaction_postId_idx" ON "ProjectNewsReaction"("postId");

-- CreateIndex
CREATE INDEX "ProjectNewsReaction_userId_idx" ON "ProjectNewsReaction"("userId");

-- CreateIndex
CREATE INDEX "ProjectNewsReaction_type_idx" ON "ProjectNewsReaction"("type");



