-- AlterTable
ALTER TABLE "User" ADD COLUMN "avatarFrame" TEXT DEFAULT 'none';
ALTER TABLE "User" ADD COLUMN "customFrameData" TEXT;
ALTER TABLE "User" ADD COLUMN "headerTheme" TEXT DEFAULT 'default';

-- CreateTable
CREATE TABLE "PageVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "timeSpent" INTEGER NOT NULL,
    "visitDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PageVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "PageVisit_userId_idx" ON "PageVisit"("userId");

-- CreateIndex
CREATE INDEX "PageVisit_page_idx" ON "PageVisit"("page");

-- CreateIndex
CREATE INDEX "PageVisit_visitDate_idx" ON "PageVisit"("visitDate");
