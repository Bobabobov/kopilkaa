-- Один засчитанный переход на пару (реферер, посетитель): убираем дубликаты и вешаем уникальный индекс.

DELETE FROM "ReferralClick"
WHERE "rowid" NOT IN (
  SELECT MIN("rowid") FROM "ReferralClick" GROUP BY "referrerUserId", "visitorId"
);

CREATE UNIQUE INDEX "ReferralClick_referrerUserId_visitorId_key" ON "ReferralClick"("referrerUserId", "visitorId");
