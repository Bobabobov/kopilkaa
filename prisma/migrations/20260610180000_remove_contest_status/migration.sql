-- Бывшие конкурсные заявки переводим в одобренные (остаются в ленте /stories)
UPDATE "Application" SET "status" = 'APPROVED' WHERE "status" = 'CONTEST';

-- Поле публикации победителей конкурса больше не используется
ALTER TABLE "Application" DROP COLUMN "publishInStories";
