import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { backfillMissingFingerprints } from '@/lib/admin/backfillFingerprints';
import { digitsFingerprint } from '@/lib/admin/requisitesFingerprint';
import {
  clientIpStorageVariants,
  normalizeClientIp,
} from '@/lib/http/clientIp';
import type { AdminUserLinkRef } from '@/types/admin';

export type UserAccountLinks = {
  samePayment: AdminUserLinkRef[];
  sameIp: AdminUserLinkRef[];
};

/** Связи аккаунта по реквизитам и IP (поиск по всей базе заявок и выводов). */
export async function buildUserAccountLinksForUsers(
  userIds: string[],
): Promise<Map<string, UserAccountLinks>> {
  const result = new Map<string, UserAccountLinks>();
  if (userIds.length === 0) return result;

  for (const id of userIds) {
    result.set(id, { samePayment: [], sameIp: [] });
  }

  await backfillMissingFingerprints();

  const [appsOnPage, withdrawalsOnPage] = await Promise.all([
    prisma.application.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        payment: true,
        paymentFingerprint: true,
        submitterIp: true,
      },
    }),
    prisma.goodDeedWithdrawalRequest.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        details: true,
        detailsFingerprint: true,
      },
    }),
  ]);

  const pageFingerprints = new Set<string>();
  const pageIpsNormalized = new Set<string>();
  for (const a of appsOnPage) {
    const fp = a.paymentFingerprint ?? digitsFingerprint(a.payment);
    if (fp) pageFingerprints.add(fp);
    const nip = normalizeClientIp(a.submitterIp);
    if (nip) pageIpsNormalized.add(nip);
  }
  for (const w of withdrawalsOnPage) {
    const fp = w.detailsFingerprint ?? digitsFingerprint(w.details);
    if (fp) pageFingerprints.add(fp);
  }

  const fpList = [...pageFingerprints];
  const ipQueryList = [
    ...new Set(
      [...pageIpsNormalized].flatMap((ip) => clientIpStorageVariants(ip)),
    ),
  ];

  const appOr: Prisma.ApplicationWhereInput[] = [];
  if (fpList.length) {
    appOr.push({ paymentFingerprint: { in: fpList } });
  }
  if (ipQueryList.length) {
    appOr.push({ submitterIp: { in: ipQueryList } });
  }

  const [globalApps, globalWithdrawals] = await Promise.all([
    appOr.length
      ? prisma.application.findMany({
          where: { OR: appOr },
          select: {
            userId: true,
            payment: true,
            paymentFingerprint: true,
            submitterIp: true,
          },
        })
      : Promise.resolve([]),
    fpList.length
      ? prisma.goodDeedWithdrawalRequest.findMany({
          where: { detailsFingerprint: { in: fpList } },
          select: {
            userId: true,
            details: true,
            detailsFingerprint: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const fingerprintToUserIds = new Map<string, Set<string>>();
  const ipToUserIds = new Map<string, Set<string>>();

  const addFp = (fp: string | null, uid: string) => {
    if (!fp) return;
    let set = fingerprintToUserIds.get(fp);
    if (!set) {
      set = new Set();
      fingerprintToUserIds.set(fp, set);
    }
    set.add(uid);
  };
  const addIp = (rawIp: string | null | undefined, uid: string) => {
    const nip = normalizeClientIp(rawIp);
    if (!nip) return;
    let set = ipToUserIds.get(nip);
    if (!set) {
      set = new Set();
      ipToUserIds.set(nip, set);
    }
    set.add(uid);
  };

  for (const row of globalApps) {
    addFp(row.paymentFingerprint ?? digitsFingerprint(row.payment), row.userId);
    addIp(row.submitterIp, row.userId);
  }
  for (const row of globalWithdrawals) {
    addFp(
      row.detailsFingerprint ?? digitsFingerprint(row.details),
      row.userId,
    );
  }

  const userApps = new Map<string, typeof appsOnPage>();
  for (const app of appsOnPage) {
    const list = userApps.get(app.userId) ?? [];
    list.push(app);
    userApps.set(app.userId, list);
  }
  const userWithdrawals = new Map<string, typeof withdrawalsOnPage>();
  for (const w of withdrawalsOnPage) {
    const list = userWithdrawals.get(w.userId) ?? [];
    list.push(w);
    userWithdrawals.set(w.userId, list);
  }

  const linkedIds = new Set<string>();
  const linksByUserId = new Map<
    string,
    { samePayment: string[]; sameIp: string[] }
  >();

  for (const userId of userIds) {
    const myFingerprints = new Set<string>();
    const myIps = new Set<string>();
    for (const app of userApps.get(userId) ?? []) {
      const fp = app.paymentFingerprint ?? digitsFingerprint(app.payment);
      if (fp) myFingerprints.add(fp);
      const nip = normalizeClientIp(app.submitterIp);
      if (nip) myIps.add(nip);
    }
    for (const w of userWithdrawals.get(userId) ?? []) {
      const fp = w.detailsFingerprint ?? digitsFingerprint(w.details);
      if (fp) myFingerprints.add(fp);
    }

    const samePaymentIds = new Set<string>();
    const sameIpIds = new Set<string>();
    for (const fp of myFingerprints) {
      const uids = fingerprintToUserIds.get(fp);
      if (uids) {
        for (const uid of uids) {
          if (uid !== userId) samePaymentIds.add(uid);
        }
      }
    }
    for (const ip of myIps) {
      const uids = ipToUserIds.get(ip);
      if (uids) {
        for (const uid of uids) {
          if (uid !== userId) sameIpIds.add(uid);
        }
      }
    }

    const samePaymentArr = [...samePaymentIds].slice(0, 20);
    const sameIpArr = [...sameIpIds].slice(0, 20);
    linksByUserId.set(userId, {
      samePayment: samePaymentArr,
      sameIp: sameIpArr,
    });
    samePaymentArr.forEach((id) => linkedIds.add(id));
    sameIpArr.forEach((id) => linkedIds.add(id));
  }

  const linkedUsers =
    linkedIds.size > 0
      ? await prisma.user.findMany({
          where: { id: { in: [...linkedIds] } },
          select: { id: true, email: true, name: true },
        })
      : [];
  const linkedMap = new Map(linkedUsers.map((u) => [u.id, u]));

  for (const userId of userIds) {
    const links = linksByUserId.get(userId);
    if (!links) continue;
    result.set(userId, {
      samePayment: links.samePayment.map(
        (id) => linkedMap.get(id) ?? { id, email: null, name: null },
      ),
      sameIp: links.sameIp.map(
        (id) => linkedMap.get(id) ?? { id, email: null, name: null },
      ),
    });
  }

  return result;
}

export async function buildUserAccountLinks(
  userId: string,
): Promise<UserAccountLinks> {
  const map = await buildUserAccountLinksForUsers([userId]);
  return map.get(userId) ?? { samePayment: [], sameIp: [] };
}
