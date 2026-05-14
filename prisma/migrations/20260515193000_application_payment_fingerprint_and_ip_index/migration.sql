-- Отпечатки реквизитов для глобального поиска связей в админке (не только в рамках страницы списка).
ALTER TABLE "Application" ADD COLUMN "paymentFingerprint" TEXT;
CREATE INDEX "Application_paymentFingerprint_idx" ON "Application"("paymentFingerprint");
CREATE INDEX "Application_submitterIp_idx" ON "Application"("submitterIp");

ALTER TABLE "GoodDeedWithdrawalRequest" ADD COLUMN "detailsFingerprint" TEXT;
CREATE INDEX "GoodDeedWithdrawalRequest_detailsFingerprint_idx" ON "GoodDeedWithdrawalRequest"("detailsFingerprint");

-- Часть записей могла храниться как IPv4-mapped IPv6 — приводим к виду, совпадающему с normalizeClientIp.
UPDATE "Application"
SET "submitterIp" = SUBSTR("submitterIp", 9)
WHERE "submitterIp" LIKE '::ffff:%';
