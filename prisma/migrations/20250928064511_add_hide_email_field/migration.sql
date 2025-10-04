-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "headerTheme" TEXT DEFAULT 'default',
    "avatarFrame" TEXT DEFAULT 'none',
    "customFrameData" TEXT,
    "hideEmail" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCommentAt" DATETIME
);
INSERT INTO "new_User" ("avatar", "avatarFrame", "createdAt", "customFrameData", "email", "headerTheme", "id", "lastCommentAt", "lastSeen", "name", "passwordHash", "role") SELECT "avatar", "avatarFrame", "createdAt", "customFrameData", "email", "headerTheme", "id", "lastCommentAt", "lastSeen", "name", "passwordHash", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
