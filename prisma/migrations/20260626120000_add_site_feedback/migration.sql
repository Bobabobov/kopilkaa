-- CreateTable
CREATE TABLE "SiteFeedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "rating" INTEGER,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'popup',
    "topic" TEXT NOT NULL DEFAULT 'general',
    "topicLabel" TEXT,
    "pagePath" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "adminNote" TEXT,
    "processedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SiteFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SiteFeedback_status_idx" ON "SiteFeedback"("status");

-- CreateIndex
CREATE INDEX "SiteFeedback_createdAt_idx" ON "SiteFeedback"("createdAt");

-- CreateIndex
CREATE INDEX "SiteFeedback_userId_idx" ON "SiteFeedback"("userId");

-- CreateIndex
CREATE INDEX "SiteFeedback_topic_idx" ON "SiteFeedback"("topic");
