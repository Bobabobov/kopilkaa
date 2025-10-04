-- CreateTable
CREATE TABLE "StoryLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StoryLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StoryLike_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StoryLike_userId_idx" ON "StoryLike"("userId");

-- CreateIndex
CREATE INDEX "StoryLike_applicationId_idx" ON "StoryLike"("applicationId");

-- CreateIndex
CREATE INDEX "StoryLike_createdAt_idx" ON "StoryLike"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StoryLike_userId_applicationId_key" ON "StoryLike"("userId", "applicationId");
