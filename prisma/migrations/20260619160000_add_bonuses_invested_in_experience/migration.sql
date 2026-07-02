-- Бонусы копятся отдельно; пользователь вручную вкладывает их в опыт.
ALTER TABLE "User" ADD COLUMN "bonusesInvestedInExperience" INTEGER NOT NULL DEFAULT 0;

-- Ранее опыт мог автоматически синхронизироваться с балансом бонусов.
UPDATE "User"
SET "bonusesInvestedInExperience" = "experience"
WHERE "experience" > 0;
