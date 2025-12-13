/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Achievement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");
