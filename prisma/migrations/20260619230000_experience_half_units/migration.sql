-- Опыт в БД хранится в половинках: 1 единица = 0,5 опыта для отображения.
UPDATE "User" SET "experience" = "experience" * 2;
