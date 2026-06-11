import { prisma } from "@/lib/db";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";

/** Подтягивает отпечатки для старых заявок/выводов (порция за запрос). */
export async function backfillMissingFingerprints(): Promise<void> {
  const apps = await prisma.application.findMany({
    where: { paymentFingerprint: null },
    take: 300,
    select: { id: true, payment: true },
  });
  if (apps.length) {
    await prisma.$transaction(
      apps.map((row) =>
        prisma.application.update({
          where: { id: row.id },
          data: { paymentFingerprint: digitsFingerprint(row.payment) },
        }),
      ),
    );
  }

  const wds = await prisma.goodDeedWithdrawalRequest.findMany({
    where: { detailsFingerprint: null },
    take: 200,
    select: { id: true, details: true },
  });
  if (wds.length) {
    await prisma.$transaction(
      wds.map((row) =>
        prisma.goodDeedWithdrawalRequest.update({
          where: { id: row.id },
          data: { detailsFingerprint: digitsFingerprint(row.details) },
        }),
      ),
    );
  }
}
