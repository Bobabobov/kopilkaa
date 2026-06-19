-- CreateTable
CREATE TABLE "TontineRound" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "roundNumber" INTEGER NOT NULL DEFAULT 1,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "winnerId" TEXT,
    CONSTRAINT "TontineRound_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TontineParticipant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ALIVE',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastCheckInDate" TEXT,
    "lastCheckInAt" DATETIME,
    "checkInStreak" INTEGER NOT NULL DEFAULT 1,
    "eliminatedAt" DATETIME,
    CONSTRAINT "TontineParticipant_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "TontineRound" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TontineParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TontineCheckIn" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "participantId" TEXT NOT NULL,
    "checkInDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TontineCheckIn_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "TontineParticipant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "TontineRound_status_idx" ON "TontineRound"("status");
CREATE INDEX "TontineRound_startedAt_idx" ON "TontineRound"("startedAt");
CREATE INDEX "TontineParticipant_roundId_status_idx" ON "TontineParticipant"("roundId", "status");
CREATE INDEX "TontineParticipant_userId_idx" ON "TontineParticipant"("userId");
CREATE UNIQUE INDEX "TontineParticipant_roundId_userId_key" ON "TontineParticipant"("roundId", "userId");
CREATE INDEX "TontineCheckIn_participantId_idx" ON "TontineCheckIn"("participantId");
CREATE UNIQUE INDEX "TontineCheckIn_participantId_checkInDate_key" ON "TontineCheckIn"("participantId", "checkInDate");
