import type {
  ApplicationIntegrity,
  ApplicationIntegrityAccount,
} from "@/types/admin";

export const REJECT_MULTI_ACCOUNT_REPLY_ID = "reject-multiaccount";

const MULTI_ACCOUNT_INTRO =
  "Заявка отклонена: использование нескольких аккаунтов запрещено правилами платформы.";

function userLabel(name: string | null | undefined, email: string | null | undefined): string {
  if (name?.trim()) return name.trim();
  if (email?.trim()) return email.trim();
  return "Без имени";
}

/** Уникальные связанные аккаунты из результата проверки заявки. */
export function collectLinkedAccounts(
  integrity?: ApplicationIntegrity | null,
): ApplicationIntegrityAccount[] {
  if (!integrity) return [];

  const map = new Map<string, ApplicationIntegrityAccount>();
  for (const reason of integrity.reasons) {
    for (const account of reason.accounts ?? []) {
      if (!map.has(account.userId)) map.set(account.userId, account);
    }
  }
  for (const link of integrity.links.sameIp) {
    if (!map.has(link.userId)) {
      map.set(link.userId, {
        userId: link.userId,
        userLabel: link.userLabel,
        userAvatar: link.userAvatar,
      });
    }
  }
  for (const link of integrity.links.samePayment) {
    if (!map.has(link.userId)) {
      map.set(link.userId, {
        userId: link.userId,
        userLabel: link.userLabel,
        userAvatar: link.userAvatar,
      });
    }
  }
  return [...map.values()];
}

/** Связанные аккаунты со страницы одной заявки (sameIp / samePayment). */
export function collectLinkedAccountsFromRefs(
  sameIp: Array<{
    user: { id: string; name: string | null; email: string | null };
  }>,
  samePayment: Array<{
    user: { id: string; name: string | null; email: string | null };
  }>,
  currentUserId: string,
): ApplicationIntegrityAccount[] {
  const map = new Map<string, ApplicationIntegrityAccount>();

  const add = (user: {
    id: string;
    name: string | null;
    email: string | null;
  }) => {
    if (user.id === currentUserId || map.has(user.id)) return;
    map.set(user.id, {
      userId: user.id,
      userLabel: userLabel(user.name, user.email),
      userAvatar: null,
    });
  };

  for (const row of sameIp) add(row.user);
  for (const row of samePayment) add(row.user);

  return [...map.values()];
}

/** Текст отказа по мультиаккаунту с перечислением найденных связей. */
export function buildMultiAccountRejectComment(
  linkedAccounts: ApplicationIntegrityAccount[],
): string {
  if (linkedAccounts.length === 0) {
    return `${MULTI_ACCOUNT_INTRO}\n\nСвязанные аккаунты по IP и реквизитам в системе не обнаружены.`;
  }

  const lines = linkedAccounts.map((a) => `— ${a.userLabel}`);
  return `${MULTI_ACCOUNT_INTRO}\n\nОбнаружены связи с другими аккаунтами:\n${lines.join("\n")}`;
}
