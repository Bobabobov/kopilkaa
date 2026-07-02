-- Уровень и опыт пользователя для профиля и будущих механик
ALTER TABLE "User" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "User" ADD COLUMN "experience" INTEGER NOT NULL DEFAULT 0;
