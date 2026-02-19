-- One-time backfill: mark all existing REJECTED applications as "rejected with level decrease"
-- so profile stats "Отклонено с понижением" show correctly without manually re-saving each application.
-- New rejections will set this flag via the admin UI; this only fixes historical data.
UPDATE "Application"
SET "trustDecreasedAtDecision" = true
WHERE status = 'REJECTED' AND "trustDecreasedAtDecision" = false;
