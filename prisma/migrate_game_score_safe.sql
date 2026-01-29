-- Безопасная миграция: переносим данные из gameType в gameKey
-- Выполните через: npx prisma db execute --schema prisma/schema.prisma --file prisma/migrate_game_score_safe.sql

-- Шаг 1: Добавляем новые колонки с дефолтами (если их еще нет)
-- Проверяем и добавляем только если колонки отсутствуют
-- SQLite не поддерживает IF NOT EXISTS для ALTER TABLE ADD COLUMN, поэтому проверяем через PRAGMA

-- Добавляем gameKey (если нет) и копируем данные из gameType
-- Сначала добавляем gameKey как nullable
ALTER TABLE "GameScore" ADD COLUMN "gameKey_temp" TEXT;
UPDATE "GameScore" SET "gameKey_temp" = COALESCE("gameType", 'coin-catch');
ALTER TABLE "GameScore" ADD COLUMN "gameKey" TEXT NOT NULL DEFAULT 'coin-catch';
UPDATE "GameScore" SET "gameKey" = "gameKey_temp";
-- Удаляем временную колонку (SQLite не поддерживает DROP COLUMN напрямую, поэтому оставляем)

-- Добавляем weekKey
ALTER TABLE "GameScore" ADD COLUMN "weekKey" TEXT NOT NULL DEFAULT '2026-W05';

-- Добавляем displayName
ALTER TABLE "GameScore" ADD COLUMN "displayName" TEXT NOT NULL DEFAULT 'Игрок';

-- Теперь можно безопасно удалить старые колонки через Prisma db push
