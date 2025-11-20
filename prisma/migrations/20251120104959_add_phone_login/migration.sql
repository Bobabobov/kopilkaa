-- CreateTable
CREATE TABLE "PhoneLoginCode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PhoneLoginCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "vkLink" TEXT,
    "telegramLink" TEXT,
    "youtubeLink" TEXT,
    "headerTheme" TEXT DEFAULT 'default',
    "avatarFrame" TEXT DEFAULT 'none',
    "customFrameData" TEXT,
    "hideEmail" BOOLEAN NOT NULL DEFAULT true,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCommentAt" DATETIME,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedUntil" DATETIME,
    "bannedReason" TEXT
);
INSERT INTO "new_User" ("avatar", "avatarFrame", "bannedReason", "bannedUntil", "createdAt", "customFrameData", "email", "headerTheme", "hideEmail", "id", "isBanned", "lastCommentAt", "lastSeen", "name", "passwordHash", "role", "telegramLink", "username", "vkLink", "youtubeLink") SELECT "avatar", "avatarFrame", "bannedReason", "bannedUntil", "createdAt", "customFrameData", "email", "headerTheme", "hideEmail", "id", "isBanned", "lastCommentAt", "lastSeen", "name", "passwordHash", "role", "telegramLink", "username", "vkLink", "youtubeLink" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PhoneLoginCode_userId_idx" ON "PhoneLoginCode"("userId");

-- CreateIndex
CREATE INDEX "PhoneLoginCode_code_idx" ON "PhoneLoginCode"("code");

-- CreateIndex
CREATE INDEX "PhoneLoginCode_expiresAt_idx" ON "PhoneLoginCode"("expiresAt");
