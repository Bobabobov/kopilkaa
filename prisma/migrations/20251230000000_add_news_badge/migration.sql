-- CreateEnum
CREATE TABLE "ProjectNewsBadge" (
  "value" TEXT NOT NULL PRIMARY KEY
);
INSERT INTO "ProjectNewsBadge" ("value") VALUES ('UPDATE');
INSERT INTO "ProjectNewsBadge" ("value") VALUES ('PLANS');
INSERT INTO "ProjectNewsBadge" ("value") VALUES ('THOUGHTS');
INSERT INTO "ProjectNewsBadge" ("value") VALUES ('IMPORTANT');

-- AlterTable
ALTER TABLE "ProjectNewsPost" ADD COLUMN "badge" TEXT;

-- CreateIndex
CREATE INDEX "ProjectNewsPost_badge_idx" ON "ProjectNewsPost"("badge");

