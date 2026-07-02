import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { backfillMissingFingerprints } from "@/lib/admin/backfillFingerprints";
import { digitsFingerprint } from "@/lib/admin/requisitesFingerprint";
import {
  buildApplicationIntegrity,
  type ApplicationIntegrity,
} from "@/lib/admin/applicationIntegrity";
import {
  clientIpStorageVariants,
  normalizeClientIp,
} from "@/lib/http/clientIp";

type BatchApplication = {
  id: string;
  userId: string;
  title: string;
  payment: string;
  paymentFingerprint: string | null;
  submitterIp: string | null;
  deviceFingerprint: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  user: {
    name: string | null;
    email: string | null;
  };
};

export async function buildApplicationIntegrityBatch(
  items: BatchApplication[],
): Promise<Map<string, ApplicationIntegrity>> {
  const result = new Map<string, ApplicationIntegrity>();
  if (items.length === 0) return result;

  await backfillMissingFingerprints();

  const fpByAppId = new Map<string, string | null>();
  const ipByAppId = new Map<string, string | null>();
  const deviceByAppId = new Map<string, string | null>();
  const allFps = new Set<string>();
  const allIpVariants = new Set<string>();
  const allDeviceFps = new Set<string>();

  for (const it of items) {
    const fp = it.paymentFingerprint ?? digitsFingerprint(it.payment);
    fpByAppId.set(it.id, fp);
    const nip = normalizeClientIp(it.submitterIp);
    ipByAppId.set(it.id, nip);
    const deviceFp = it.deviceFingerprint?.trim().toLowerCase() || null;
    deviceByAppId.set(it.id, deviceFp);
    if (fp) allFps.add(fp);
    if (nip) {
      for (const v of clientIpStorageVariants(nip)) allIpVariants.add(v);
    }
    if (deviceFp) allDeviceFps.add(deviceFp);
  }

  const fpList = [...allFps];
  const ipList = [...allIpVariants];
  const deviceList = [...allDeviceFps];
  const appOr: Prisma.ApplicationWhereInput[] = [];
  if (fpList.length) appOr.push({ paymentFingerprint: { in: fpList } });
  if (ipList.length) appOr.push({ submitterIp: { in: ipList } });
  if (deviceList.length) appOr.push({ deviceFingerprint: { in: deviceList } });

  const [globalApps, globalWithdrawals] = await Promise.all([
    appOr.length
      ? prisma.application.findMany({
          where: { OR: appOr },
          select: {
            id: true,
            userId: true,
            title: true,
            status: true,
            payment: true,
            paymentFingerprint: true,
            submitterIp: true,
            deviceFingerprint: true,
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        })
      : Promise.resolve([]),
    fpList.length
      ? prisma.goodDeedWithdrawalRequest.findMany({
          where: { detailsFingerprint: { in: fpList } },
          select: {
            id: true,
            userId: true,
            detailsFingerprint: true,
            user: { select: { id: true, name: true, email: true, avatar: true } },
          },
        })
      : Promise.resolve([]),
  ]);

  const fpToApps = new Map<
    string,
    {
      id: string;
      userId: string;
      title: string;
      status: BatchApplication["status"];
      userName: string | null;
      userEmail: string | null;
      userAvatar: string | null;
    }[]
  >();
  const ipToApps = new Map<
    string,
    {
      id: string;
      userId: string;
      title: string;
      status: BatchApplication["status"];
      userName: string | null;
      userEmail: string | null;
      userAvatar: string | null;
    }[]
  >();
  const deviceToApps = new Map<
    string,
    {
      id: string;
      userId: string;
      title: string;
      status: BatchApplication["status"];
      userName: string | null;
      userEmail: string | null;
      userAvatar: string | null;
    }[]
  >();
  const fpToWithdrawals = new Map<
    string,
    {
      id: string;
      userId: string;
      userName: string | null;
      userEmail: string | null;
      userAvatar: string | null;
    }[]
  >();

  const addFpApp = (
    fp: string | null,
    row: (typeof globalApps)[number],
  ) => {
    if (!fp) return;
    const list = fpToApps.get(fp) ?? [];
    list.push({
      id: row.id,
      userId: row.userId,
      title: row.title,
      status: row.status,
      userName: row.user.name,
      userEmail: row.user.email,
      userAvatar: row.user.avatar,
    });
    fpToApps.set(fp, list);
  };

  const addIpApp = (
    nip: string | null,
    row: (typeof globalApps)[number],
  ) => {
    if (!nip) return;
    const list = ipToApps.get(nip) ?? [];
    list.push({
      id: row.id,
      userId: row.userId,
      title: row.title,
      status: row.status,
      userName: row.user.name,
      userEmail: row.user.email,
      userAvatar: row.user.avatar,
    });
    ipToApps.set(nip, list);
  };

  const addDeviceApp = (
    deviceFp: string | null,
    row: (typeof globalApps)[number],
  ) => {
    if (!deviceFp) return;
    const list = deviceToApps.get(deviceFp) ?? [];
    list.push({
      id: row.id,
      userId: row.userId,
      title: row.title,
      status: row.status,
      userName: row.user.name,
      userEmail: row.user.email,
      userAvatar: row.user.avatar,
    });
    deviceToApps.set(deviceFp, list);
  };

  for (const row of globalApps) {
    const fp = row.paymentFingerprint ?? digitsFingerprint(row.payment);
    addFpApp(fp, row);
    addIpApp(normalizeClientIp(row.submitterIp), row);
    addDeviceApp(row.deviceFingerprint?.trim().toLowerCase() || null, row);
  }

  for (const row of globalWithdrawals) {
    const fp = row.detailsFingerprint;
    if (!fp) continue;
    const list = fpToWithdrawals.get(fp) ?? [];
    list.push({
      id: row.id,
      userId: row.userId,
      userName: row.user.name,
      userEmail: row.user.email,
      userAvatar: row.user.avatar,
    });
    fpToWithdrawals.set(fp, list);
  }

  for (const it of items) {
    const fp = fpByAppId.get(it.id) ?? null;
    const nip = ipByAppId.get(it.id) ?? null;
    const deviceFp = deviceByAppId.get(it.id) ?? null;

    const sameIpRaw = nip ? (ipToApps.get(nip) ?? []) : [];
    const sameIpMatches = sameIpRaw
      .filter((a) => a.id !== it.id)
      .map((a) => ({
        kind: "application" as const,
        id: a.id,
        userId: a.userId,
        userName: a.userName,
        userEmail: a.userEmail,
        userAvatar: a.userAvatar,
        title: a.title,
        status: a.status,
      }));

    const samePaymentMatches: Parameters<
      typeof buildApplicationIntegrity
    >[0]["samePaymentMatches"] = [];

    if (fp) {
      for (const a of fpToApps.get(fp) ?? []) {
        if (a.id === it.id) continue;
        samePaymentMatches.push({
          kind: "application",
          id: a.id,
          userId: a.userId,
          userName: a.userName,
          userEmail: a.userEmail,
          userAvatar: a.userAvatar,
          title: a.title,
          status: a.status,
        });
      }
      for (const w of fpToWithdrawals.get(fp) ?? []) {
        samePaymentMatches.push({
          kind: "withdrawal",
          id: w.id,
          userId: w.userId,
          userName: w.userName,
          userEmail: w.userEmail,
          userAvatar: w.userAvatar,
        });
      }
    }

    const sameDeviceRaw = deviceFp ? (deviceToApps.get(deviceFp) ?? []) : [];
    const sameDeviceMatches = sameDeviceRaw
      .filter((a) => a.id !== it.id)
      .map((a) => ({
        kind: "application" as const,
        id: a.id,
        userId: a.userId,
        userName: a.userName,
        userEmail: a.userEmail,
        userAvatar: a.userAvatar,
        title: a.title,
        status: a.status,
      }));

    result.set(
      it.id,
      buildApplicationIntegrity({
        applicationId: it.id,
        userId: it.userId,
        submitterIp: nip,
        sameIpMatches,
        samePaymentMatches,
        sameDeviceMatches,
      }),
    );
  }

  return result;
}
