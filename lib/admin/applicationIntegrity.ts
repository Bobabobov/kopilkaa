import type {
  ApplicationIntegrity,
  ApplicationIntegrityAccount,
  ApplicationIntegrityLink,
  ApplicationIntegrityReason,
  ApplicationStatus,
} from "@/types/admin";

export type { ApplicationIntegrity, ApplicationIntegrityLink };

const MAX_LINKS = 5;
const MAX_ACCOUNTS = 8;

function userLabel(name: string | null, email: string | null): string {
  if (name?.trim()) return name.trim();
  if (email?.trim()) return email.trim();
  return "Без имени";
}

type IntegrityMatch = {
  kind: "application" | "withdrawal";
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userAvatar: string | null;
  title?: string;
  status?: ApplicationStatus;
};

function uniqueAccounts(matches: IntegrityMatch[]): ApplicationIntegrityAccount[] {
  const map = new Map<string, ApplicationIntegrityAccount>();
  for (const m of matches) {
    if (map.has(m.userId)) continue;
    map.set(m.userId, {
      userId: m.userId,
      userLabel: userLabel(m.userName, m.userEmail),
      userAvatar: m.userAvatar,
    });
  }
  return [...map.values()].slice(0, MAX_ACCOUNTS);
}

export function buildApplicationIntegrity(input: {
  applicationId: string;
  userId: string;
  submitterIp: string | null;
  sameIpMatches: IntegrityMatch[];
  samePaymentMatches: IntegrityMatch[];
  sameDeviceMatches?: IntegrityMatch[];
}): ApplicationIntegrity {
  const reasons: ApplicationIntegrityReason[] = [];

  const sameIp = input.sameIpMatches.filter((m) => m.userId !== input.userId);
  const samePayment = input.samePaymentMatches.filter(
    (m) => m.userId !== input.userId,
  );
  const sameDevice = (input.sameDeviceMatches ?? []).filter(
    (m) => m.userId !== input.userId,
  );

  if (sameIp.length > 0) {
    const ipPart = input.submitterIp ? ` ${input.submitterIp}` : "";
    reasons.push({
      key: "same-ip",
      message: `С IP${ipPart} заявки подавали другие аккаунты (${sameIp.length})`,
      accounts: uniqueAccounts(sameIp),
    });
  }

  const paymentApps = samePayment.filter((m) => m.kind === "application");
  const paymentWithdrawals = samePayment.filter(
    (m) => m.kind === "withdrawal",
  );

  if (paymentApps.length > 0) {
    reasons.push({
      key: "same-payment-apps",
      message: `Реквизиты совпадают с заявками других пользователей (${paymentApps.length})`,
      accounts: uniqueAccounts(paymentApps),
    });
  }

  if (paymentWithdrawals.length > 0) {
    reasons.push({
      key: "same-payment-withdrawals",
      message: `Реквизиты совпадают с выводами бонусов других пользователей (${paymentWithdrawals.length})`,
      accounts: uniqueAccounts(paymentWithdrawals),
    });
  }

  if (sameDevice.length > 0) {
    reasons.push({
      key: "same-device",
      message: `С этого устройства заявки подавали другие аккаунты (${sameDevice.length})`,
      accounts: uniqueAccounts(sameDevice),
    });
  }

  const toLink = (m: IntegrityMatch): ApplicationIntegrityLink => ({
    kind: m.kind,
    id: m.id,
    userId: m.userId,
    userLabel: userLabel(m.userName, m.userEmail),
    userAvatar: m.userAvatar,
    title: m.title,
    status: m.status,
  });

  const isClean = reasons.length === 0;

  return {
    isClean,
    verdict: isClean ? "Заявка чистая" : "Есть подозрения",
    reasons: isClean
      ? [
          {
            key: "clean",
            message:
              "Совпадений по IP, реквизитам и устройству с другими аккаунтами не найдено",
          },
        ]
      : reasons,
    submitterIp: input.submitterIp,
    sameIpCount: sameIp.length,
    samePaymentCount: paymentApps.length + paymentWithdrawals.length,
    sameDeviceCount: sameDevice.length,
    links: {
      sameIp: sameIp.slice(0, MAX_LINKS).map(toLink),
      samePayment: samePayment.slice(0, MAX_LINKS).map(toLink),
      sameDevice: sameDevice.slice(0, MAX_LINKS).map(toLink),
    },
  };
}
