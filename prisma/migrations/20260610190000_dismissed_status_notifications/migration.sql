-- CreateTable
CREATE TABLE "DismissedStatusNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "dismissedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DismissedStatusNotification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DismissedStatusNotification_userId_notificationId_key" ON "DismissedStatusNotification"("userId", "notificationId");

-- CreateIndex
CREATE INDEX "DismissedStatusNotification_userId_idx" ON "DismissedStatusNotification"("userId");
