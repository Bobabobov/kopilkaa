-- CreateTable
CREATE TABLE "GameRuntimeSession" (
    "userId" TEXT NOT NULL,
    "gameKey" TEXT NOT NULL,
    "payloadJson" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("userId", "gameKey")
);

-- CreateIndex
CREATE INDEX "GameRuntimeSession_expiresAt_idx" ON "GameRuntimeSession"("expiresAt");
