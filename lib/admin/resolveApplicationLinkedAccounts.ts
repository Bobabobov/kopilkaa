import { prisma } from "@/lib/db";
import { buildApplicationIntegrityBatch } from "@/lib/admin/buildApplicationIntegrityBatch";
import { collectLinkedAccounts } from "@/lib/admin/buildMultiAccountRejectComment";
import type { ApplicationIntegrityAccount } from "@/types/admin";

const MULTI_ACCOUNT_MARKER = "нескольких аккаунтов запрещено";

/** Связанные аккаунты для заявки (по IP и реквизитам). */
export async function resolveApplicationLinkedAccounts(
  applicationId: string,
): Promise<ApplicationIntegrityAccount[]> {
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      userId: true,
      title: true,
      payment: true,
      paymentFingerprint: true,
      submitterIp: true,
      deviceFingerprint: true,
      status: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!app) return [];

  const integrityMap = await buildApplicationIntegrityBatch([
    {
      id: app.id,
      userId: app.userId,
      title: app.title,
      payment: app.payment,
      paymentFingerprint: app.paymentFingerprint,
      submitterIp: app.submitterIp,
      deviceFingerprint: app.deviceFingerprint,
      status: app.status,
      user: app.user,
    },
  ]);

  return collectLinkedAccounts(integrityMap.get(app.id));
}

export function shouldResolveLinkedAccounts(
  adminComment: string | null | undefined,
): boolean {
  if (!adminComment?.trim()) return false;
  return (
    adminComment.includes(MULTI_ACCOUNT_MARKER) ||
    adminComment.includes("Обнаружены связи с другими аккаунтами")
  );
}
