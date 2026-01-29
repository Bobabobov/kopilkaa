-- Добавляем недостающие колонки в GameScore с дефолтами для существующей строки
-- После выполнения запустите: npx prisma db push

-- SQLite: добавляем колонки с DEFAULT (существующая строка получит эти значения)
ALTER TABLE "GameScore" ADD COLUMN "displayName" TEXT NOT NULL DEFAULT 'Игрок';
ALTER TABLE "GameScore" ADD COLUMN "gameKey" TEXT NOT NULL DEFAULT 'coin-catch';
ALTER TABLE "GameScore" ADD COLUMN "weekKey" TEXT NOT NULL DEFAULT '2026-W05';
