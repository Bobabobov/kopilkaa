-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" TEXT NOT NULL DEFAULT 'COMMON',
    "type" TEXT NOT NULL DEFAULT 'SPECIAL',
    "kind" TEXT NOT NULL DEFAULT 'NORMAL',
    "isExclusive" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isSeasonal" BOOLEAN NOT NULL DEFAULT false,
    "maxCount" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" DATETIME,
    "validTo" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Achievement" ("createdAt", "description", "icon", "id", "isActive", "isExclusive", "maxCount", "name", "rarity", "type", "updatedAt", "validFrom", "validTo") SELECT "createdAt", "description", "icon", "id", "isActive", "isExclusive", "maxCount", "name", "rarity", "type", "updatedAt", "validFrom", "validTo" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
CREATE INDEX "Achievement_rarity_idx" ON "Achievement"("rarity");
CREATE INDEX "Achievement_type_idx" ON "Achievement"("type");
CREATE INDEX "Achievement_isActive_idx" ON "Achievement"("isActive");
CREATE INDEX "Achievement_validFrom_idx" ON "Achievement"("validFrom");
CREATE INDEX "Achievement_validTo_idx" ON "Achievement"("validTo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
