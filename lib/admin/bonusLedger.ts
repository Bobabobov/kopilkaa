import {
  GoodDeedSubmissionStatus,
  GoodDeedWithdrawalStatus,
} from '@prisma/client';
import {
  ADMIN_BONUS_DEDUCT_COMMENT,
  ADMIN_BONUS_GRANT_COMMENT,
  ADMIN_LEVEL_RESET_BONUS_COMMENT,
} from '@/lib/admin/bonusWithdrawalBlock';
import {
  BONUS_SOURCE_LABELS,
  BonusSourceCategory,
  categorizeBonusGrant,
} from '@/lib/admin/bonusGrantCategory';
import {
  BONUS_TRANSACTION_DESCRIPTIONS,
  BONUS_TRANSACTION_TYPES,
} from '@/lib/bonusTransactions/constants';
import { prisma } from '@/lib/db';
import {
  DAILY_BONUS_GRANT_COMMENT,
  DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX,
  DAILY_BONUS_RISK_LOSS_GRANT_COMMENT,
  DAILY_BONUS_RISK_WIN_GRANT_COMMENT,
} from '@/lib/dailyBonus/constants';
import { DAILY_CHEST_GRANT_COMMENT } from '@/lib/dailyChest/constants';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';

export type BonusLedgerEventKind = 'earn' | 'spend' | 'info';

export type BonusLedgerEventCategory =
  | BonusSourceCategory
  | 'application'
  | 'withdrawal';

export type BonusLedgerEvent = {
  id: string;
  kind: BonusLedgerEventKind;
  amountBonuses: number;
  category: BonusLedgerEventCategory;
  categoryLabel: string;
  title: string;
  description: string;
  createdAt: string;
  applicationId?: string | null;
};

export type UserBonusEarnBreakdown = Record<BonusSourceCategory, number>;

export type UserBonusLedger = {
  bySource: UserBonusEarnBreakdown;
  totals: {
    earned: number;
    spent: number;
  };
  events: BonusLedgerEvent[];
};

type BonusLedgerSubmissionRow = {
  id: string;
  reward: number;
  taskTitle: string | null;
  updatedAt: Date;
};

type BonusLedgerGrantRow = {
  id: string;
  amountBonuses: number;
  comment: string | null;
  grantedById: string | null;
  createdAt: Date;
};

type BonusLedgerTransactionRow = {
  id: string;
  amount: number;
  type: string;
  description: string | null;
  createdAt: Date;
  applicationId: string | null;
};

type BonusLedgerWithdrawalRow = {
  id: string;
  amountBonuses: number;
  bankName: string;
  status: GoodDeedWithdrawalStatus;
  adminComment: string | null;
  createdAt: Date;
  reviewedAt: Date | null;
};

type BonusLedgerRawData = {
  submissions: BonusLedgerSubmissionRow[];
  grants: BonusLedgerGrantRow[];
  transactions: BonusLedgerTransactionRow[];
  withdrawals: BonusLedgerWithdrawalRow[];
};

type GameLedgerMeta = {
  title: string;
  categoryLabel: string;
};

const BONUS_SOURCE_CATEGORIES: BonusSourceCategory[] = [
  'goodDeeds',
  'referrals',
  'dailyBonus',
  'dailyChest',
  'adminManual',
  'other',
];

function emptyEarnBreakdown(): UserBonusEarnBreakdown {
  return {
    goodDeeds: 0,
    referrals: 0,
    dailyBonus: 0,
    dailyChest: 0,
    adminManual: 0,
    other: 0,
  };
}

function buildEarnBreakdown(events: BonusLedgerEvent[]): UserBonusEarnBreakdown {
  const breakdown = emptyEarnBreakdown();
  for (const event of events) {
    if (event.amountBonuses <= 0) continue;
    if (!BONUS_SOURCE_CATEGORIES.includes(event.category as BonusSourceCategory)) {
      continue;
    }
    breakdown[event.category as BonusSourceCategory] += event.amountBonuses;
  }
  return breakdown;
}

function sumLedgerTotals(events: BonusLedgerEvent[]): {
  earned: number;
  spent: number;
} {
  let earned = 0;
  let spent = 0;
  for (const event of events) {
    if (event.amountBonuses > 0) earned += event.amountBonuses;
    if (event.amountBonuses < 0) spent += Math.abs(event.amountBonuses);
  }
  return { earned, spent };
}

function collectBonusLedgerEvents(data: BonusLedgerRawData): BonusLedgerEvent[] {
  const events: BonusLedgerEvent[] = [];

  for (const row of data.submissions) {
    const title = row.taskTitle?.trim() || 'Доброе дело';
    events.push({
      id: `submission-${row.id}`,
      kind: 'earn',
      amountBonuses: row.reward,
      category: 'goodDeeds',
      categoryLabel: BONUS_SOURCE_LABELS.goodDeeds,
      title: 'Награда за доброе дело',
      description: `Одобрено задание «${title}»`,
      createdAt: row.updatedAt.toISOString(),
    });
  }

  for (const grant of data.grants) {
    const category = categorizeBonusGrant(grant.comment, grant.grantedById);
    const { title, description } = formatBonusGrantDescription(
      grant.comment,
      grant.amountBonuses,
    );
    events.push({
      id: `grant-${grant.id}`,
      kind: kindFromAmount(grant.amountBonuses),
      amountBonuses: grant.amountBonuses,
      category,
      categoryLabel: BONUS_SOURCE_LABELS[category],
      title,
      description,
      createdAt: grant.createdAt.toISOString(),
    });
  }

  for (const tx of data.transactions) {
    if (tx.type === BONUS_TRANSACTION_TYPES.APPLICATION_SUBMIT_FEE) {
      const isFree =
        tx.description === BONUS_TRANSACTION_DESCRIPTIONS.FIRST_APPLICATION_FREE;
      if (isFree || tx.amount <= 0) {
        events.push({
          id: `tx-${tx.id}`,
          kind: 'info',
          amountBonuses: 0,
          category: 'application',
          categoryLabel: 'Заявка',
          title: 'Первая заявка',
          description: 'Подача первой заявки — без списания бонусов',
          createdAt: tx.createdAt.toISOString(),
          applicationId: tx.applicationId,
        });
        continue;
      }

      events.push({
        id: `tx-${tx.id}`,
        kind: 'spend',
        amountBonuses: -tx.amount,
        category: 'application',
        categoryLabel: 'Заявка',
        title: 'Подача заявки',
        description: `Списание бонусов за подачу заявки (${tx.amount} бон.)`,
        createdAt: tx.createdAt.toISOString(),
        applicationId: tx.applicationId,
      });
      continue;
    }

    const gameMeta = mapGameLedgerMeta(tx.type);
    if (gameMeta) {
      events.push({
        id: `tx-${tx.id}`,
        kind: tx.amount > 0 ? 'spend' : 'info',
        amountBonuses: tx.amount > 0 ? -tx.amount : 0,
        category: 'other',
        categoryLabel: gameMeta.categoryLabel,
        title: gameMeta.title,
        description:
          tx.description?.trim() ||
          (tx.amount > 0
            ? `Списание за игровое действие (${tx.amount} бон.)`
            : 'Игровое событие'),
        createdAt: tx.createdAt.toISOString(),
        applicationId: tx.applicationId,
      });
      continue;
    }

    if (tx.type === 'GAMES_DAILY_QUEST_REWARD') {
      events.push({
        id: `tx-${tx.id}`,
        kind: 'info',
        amountBonuses: 0,
        category: 'other',
        categoryLabel: 'Игры',
        title: 'Ежедневный квест',
        description: tx.description?.trim() || 'Награда за ежедневный квест',
        createdAt: tx.createdAt.toISOString(),
        applicationId: tx.applicationId,
      });
      continue;
    }
  }

  for (const row of data.withdrawals) {
    const labels = withdrawalLabels(row.status);
    const signedAmount =
      row.status === GoodDeedWithdrawalStatus.APPROVED
        ? -row.amountBonuses
        : row.status === GoodDeedWithdrawalStatus.PENDING
          ? -row.amountBonuses
          : 0;

    events.push({
      id: `withdrawal-${row.id}`,
      kind: labels.kind,
      amountBonuses: signedAmount,
      category: 'withdrawal',
      categoryLabel: 'Вывод',
      title: labels.title,
      description: [
        labels.description,
        `Банк: ${row.bankName}`,
        row.adminComment?.trim()
          ? `Комментарий админа: ${row.adminComment.trim()}`
          : null,
      ]
        .filter(Boolean)
        .join(' · '),
      createdAt: (row.reviewedAt ?? row.createdAt).toISOString(),
    });
  }

  return events.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function mapGameLedgerMeta(txType: string): GameLedgerMeta | null {
  const gameTxPrefixes: Array<{
    prefix: string;
    categoryLabel: string;
    title: string;
  }> = [
    {
      prefix: 'GAMES_MATH_SPRINT_',
      categoryLabel: 'Игра · Математический спринт',
      title: 'Математический спринт',
    },
    {
      prefix: 'GAMES_QUICK_BALANCE_',
      categoryLabel: 'Игра · Быстрый баланс',
      title: 'Быстрый баланс',
    },
    {
      prefix: 'GAMES_ODD_NUMBER_SCHULTE_',
      categoryLabel: 'Игра · Лишнее число',
      title: 'Лишнее число',
    },
    {
      prefix: 'GAMES_SEQUENCE_',
      categoryLabel: 'Игра · Секретная последовательность',
      title: 'Секретная последовательность',
    },
    {
      prefix: 'GAMES_COLOR_CONFLICT_',
      categoryLabel: 'Игра · Цветовой конфликт',
      title: 'Цветовой конфликт',
    },
    {
      prefix: 'GAMES_BONUS_GENERATOR_',
      categoryLabel: 'Игра · Генератор бонусов',
      title: 'Генератор бонусов',
    },
  ];

  const matched = gameTxPrefixes.find((item) => txType.startsWith(item.prefix));
  if (!matched) {
    return null;
  }

  return {
    title: matched.title,
    categoryLabel: matched.categoryLabel,
  };
}

function groupRowsByUserId<T extends { userId: string }>(
  rows: T[],
): Map<string, Omit<T, 'userId'>[]> {
  const map = new Map<string, Omit<T, 'userId'>[]>();
  for (const row of rows) {
    const { userId, ...rest } = row;
    const list = map.get(userId) ?? [];
    list.push(rest as Omit<T, 'userId'>);
    map.set(userId, list);
  }
  return map;
}

export type BonusLedgerUserGroup = {
  user: {
    id: string;
    name: string;
    username: string | null;
    email: string | null;
    avatar: string | null;
  };
  totals: {
    earned: number;
    spent: number;
    net: number;
    availableBonuses: number;
    investedInExperience: number;
    eventCount: number;
  };
  lastEventAt: string | null;
  events: BonusLedgerEvent[];
};

function formatUserLabel(user: {
  name: string | null;
  username: string | null;
}): string {
  return user.name || user.username || 'Пользователь';
}

function kindFromAmount(amount: number): BonusLedgerEventKind {
  if (amount > 0) return 'earn';
  if (amount < 0) return 'spend';
  return 'info';
}

function formatMilestoneComment(comment: string): string {
  const days = comment
    .replace(DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX, '')
    .trim();
  return days
    ? `Бонус за серию ежедневных входов (${days} дн.)`
    : 'Бонус за серию ежедневных входов';
}

export function formatBonusGrantDescription(
  comment: string | null | undefined,
  amountBonuses: number,
): { title: string; description: string } {
  const normalized = (comment ?? '').trim();

  if (normalized === DAILY_CHEST_GRANT_COMMENT) {
    return {
      title: 'Ежедневный сундук',
      description: 'Случайная награда за открытие ежедневного сундука',
    };
  }
  if (normalized === DAILY_BONUS_GRANT_COMMENT) {
    return {
      title: 'Ежедневный бонус',
      description: 'Начисление за ежедневный вход на сайт',
    };
  }
  if (normalized === DAILY_BONUS_RISK_WIN_GRANT_COMMENT) {
    return {
      title: 'Рискованный бонус — выигрыш',
      description: 'Крупное начисление за удачный рискованный ежедневный бонус',
    };
  }
  if (normalized === DAILY_BONUS_RISK_LOSS_GRANT_COMMENT) {
    return {
      title: 'Рискованный бонус — проигрыш',
      description: 'Списание всего доступного баланса после неудачного риска',
    };
  }
  if (normalized.startsWith(DAILY_BONUS_MILESTONE_GRANT_COMMENT_PREFIX)) {
    const description = formatMilestoneComment(normalized);
    return { title: 'Бонус за серию', description };
  }
  if (normalized === ADMIN_BONUS_GRANT_COMMENT) {
    return {
      title: 'Начисление админом',
      description: 'Ручное начисление бонусов администратором',
    };
  }
  if (normalized === ADMIN_BONUS_DEDUCT_COMMENT) {
    return {
      title: 'Списание админом',
      description: 'Ручное списание бонусов администратором',
    };
  }
  if (normalized === ADMIN_LEVEL_RESET_BONUS_COMMENT) {
    return {
      title: 'Сброс уровня',
      description: 'Списание бонусов при сбросе уровня администратором',
    };
  }

  const lower = normalized.toLowerCase();
  if (lower.includes('реферал') || lower.includes('referral')) {
    return {
      title: 'Реферальный бонус',
      description: normalized || 'Бонус по реферальной программе',
    };
  }

  if (normalized) {
    return {
      title: amountBonuses >= 0 ? 'Начисление' : 'Списание',
      description: normalized,
    };
  }

  return {
    title: amountBonuses >= 0 ? 'Начисление бонусов' : 'Списание бонусов',
    description:
      amountBonuses >= 0
        ? 'Пополнение баланса бонусов'
        : 'Списание с баланса бонусов',
  };
}

function withdrawalLabels(status: GoodDeedWithdrawalStatus): {
  kind: BonusLedgerEventKind;
  amount: number;
  title: string;
  description: string;
} {
  if (status === GoodDeedWithdrawalStatus.APPROVED) {
    return {
      kind: 'spend',
      amount: 0,
      title: 'Вывод одобрен',
      description: 'Бонусы выведены с баланса после одобрения заявки',
    };
  }
  if (status === GoodDeedWithdrawalStatus.PENDING) {
    return {
      kind: 'info',
      amount: 0,
      title: 'Заявка на вывод',
      description: 'Сумма зарезервирована — заявка на проверке у администратора',
    };
  }
  return {
    kind: 'info',
    amount: 0,
    title: 'Вывод отклонён',
    description: 'Заявка на вывод отклонена, бонусы остались на балансе',
  };
}

export async function buildBonusLedgerByUser(
  userMetaById: Map<
    string,
    {
      id: string;
      name: string | null;
      username: string | null;
      email: string | null;
      avatar: string | null;
    }
  >,
): Promise<BonusLedgerUserGroup[]> {
  const [submissions, grants, transactions, withdrawals] = await Promise.all([
      prisma.goodDeedSubmission.findMany({
        where: {
          status: GoodDeedSubmissionStatus.APPROVED,
          reward: { gt: 0 },
        },
        select: {
          id: true,
          userId: true,
          reward: true,
          taskTitle: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.goodDeedBonusGrant.findMany({
        select: {
          id: true,
          userId: true,
          amountBonuses: true,
          comment: true,
          grantedById: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.bonusTransaction.findMany({
        select: {
          id: true,
          userId: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
          applicationId: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.goodDeedWithdrawalRequest.findMany({
        select: {
          id: true,
          userId: true,
          amountBonuses: true,
          bankName: true,
          status: true,
          adminComment: true,
          createdAt: true,
          reviewedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
  const submissionsByUser = groupRowsByUserId(submissions);
  const grantsByUser = groupRowsByUserId(grants);
  const transactionsByUser = groupRowsByUserId(transactions);
  const withdrawalsByUser = groupRowsByUserId(withdrawals);

  const allUserIds = new Set([
    ...submissionsByUser.keys(),
    ...grantsByUser.keys(),
    ...transactionsByUser.keys(),
    ...withdrawalsByUser.keys(),
  ]);

  const eventsByUser = new Map<string, BonusLedgerEvent[]>();
  for (const userId of allUserIds) {
    const events = collectBonusLedgerEvents({
      submissions: (submissionsByUser.get(userId) ??
        []) as BonusLedgerSubmissionRow[],
      grants: (grantsByUser.get(userId) ?? []) as BonusLedgerGrantRow[],
      transactions: (transactionsByUser.get(userId) ??
        []) as BonusLedgerTransactionRow[],
      withdrawals: (withdrawalsByUser.get(userId) ??
        []) as BonusLedgerWithdrawalRow[],
    });
    if (events.length > 0) {
      eventsByUser.set(userId, events);
    }
  }

  for (const row of submissions) {
    if (!userMetaById.has(row.userId) && row.user) {
      userMetaById.set(row.userId, row.user);
    }
  }
  for (const grant of grants) {
    if (!userMetaById.has(grant.userId) && grant.user) {
      userMetaById.set(grant.userId, grant.user);
    }
  }

  const walletEntries = await Promise.all(
    Array.from(eventsByUser.keys()).map(async (userId) => {
      const wallet = await computeGoodDeedBonusWallet(userId);
      return [userId, wallet] as const;
    }),
  );
  const walletByUserId = new Map(walletEntries);

  const missingUserIds = Array.from(eventsByUser.keys()).filter(
    (userId) => !userMetaById.has(userId),
  );
  if (missingUserIds.length > 0) {
    const extraUsers = await prisma.user.findMany({
      where: { id: { in: missingUserIds } },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
      },
    });
    for (const user of extraUsers) {
      userMetaById.set(user.id, user);
    }
  }

  const groups: BonusLedgerUserGroup[] = [];

  for (const [userId, events] of eventsByUser.entries()) {
    const user = userMetaById.get(userId);
    if (!user) continue;

    const sorted = events;

    const { earned, spent } = sumLedgerTotals(sorted);

    const wallet = walletByUserId.get(userId);
    if (!wallet) continue;

    groups.push({
      user: {
        id: userId,
        name: formatUserLabel(user),
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      totals: {
        earned,
        spent,
        net: earned - spent,
        availableBonuses: wallet.availableBonuses,
        investedInExperience: wallet.bonusesInvestedInExperience,
        eventCount: sorted.length,
      },
      lastEventAt: sorted[0]?.createdAt ?? null,
      events: sorted,
    });
  }

  return groups.sort((a, b) => {
    const aTime = a.lastEventAt ? new Date(a.lastEventAt).getTime() : 0;
    const bTime = b.lastEventAt ? new Date(b.lastEventAt).getTime() : 0;
    return bTime - aTime;
  });
}

export async function buildBonusLedgerForUser(
  userId: string,
): Promise<UserBonusLedger> {
  const [submissions, grants, transactions, withdrawals] = await Promise.all([
    prisma.goodDeedSubmission.findMany({
      where: {
        userId,
        status: GoodDeedSubmissionStatus.APPROVED,
        reward: { gt: 0 },
      },
      select: {
        id: true,
        reward: true,
        taskTitle: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.goodDeedBonusGrant.findMany({
      where: { userId },
      select: {
        id: true,
        amountBonuses: true,
        comment: true,
        grantedById: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.bonusTransaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        type: true,
        description: true,
        createdAt: true,
        applicationId: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.goodDeedWithdrawalRequest.findMany({
      where: { userId },
      select: {
        id: true,
        amountBonuses: true,
        bankName: true,
        status: true,
        adminComment: true,
        createdAt: true,
        reviewedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const events = collectBonusLedgerEvents({
    submissions,
    grants,
    transactions,
    withdrawals,
  });

  return {
    bySource: buildEarnBreakdown(events),
    totals: sumLedgerTotals(events),
    events,
  };
}
