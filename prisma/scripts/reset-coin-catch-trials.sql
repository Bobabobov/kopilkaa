-- Сброс тестовых попыток (для проверки логики). Все пользователи снова получают 3 теста.
UPDATE "CoinCatchTrial" SET "testAttemptsUsed" = 0, "realGamePlayedAt" = NULL, "bannedUntil" = NULL, "updatedAt" = CURRENT_TIMESTAMP;
