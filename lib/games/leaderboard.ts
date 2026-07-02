import { prisma } from '@/lib/db';

export type GameLeaderboardId =
  | 'sequence'
  | 'math'
  | 'color'
  | 'quick-balance'
  | 'odd-number'
  | 'generator';

export interface GameLeaderboardEntry {
  id: string;
  username: string | null;
  avatar: string | null;
  score: number;
  winCount?: number;
}

export interface GameLeaderboardMeta {
  subtitle: string;
  scoreSuffix: string;
  emptyHint: string;
}

interface GameLeaderboardConfig {
  winCommentMarkers: string[];
  spendTxTypes: string[];
  scoreKind: 'record' | 'winnings';
  meta: GameLeaderboardMeta;
}

export const GAME_LEADERBOARD_IDS: GameLeaderboardId[] = [
  'sequence',
  'math',
  'color',
  'quick-balance',
  'odd-number',
  'generator',
];

export function isGameLeaderboardId(value: string): value is GameLeaderboardId {
  return (GAME_LEADERBOARD_IDS as string[]).includes(value);
}

const GAME_LEADERBOARD_CONFIG: Record<GameLeaderboardId, GameLeaderboardConfig> = {
  sequence: {
    winCommentMarkers: ['Секретную последовательность'],
    spendTxTypes: [
      'GAMES_SEQUENCE_START',
      'GAMES_SEQUENCE_EXTRA_START',
      'GAMES_SEQUENCE_ATTEMPT_PURCHASE',
    ],
    scoreKind: 'record',
    meta: {
      subtitle: 'Топ-10 рекордов',
      scoreSuffix: '',
      emptyHint: 'Станьте первым мегамозгом',
    },
  },
  math: {
    winCommentMarkers: ['математическом спринте'],
    spendTxTypes: [
      'GAMES_MATH_SPRINT_START',
      'GAMES_MATH_SPRINT_EXTRA_START',
      'GAMES_MATH_SPRINT_ATTEMPT_PURCHASE',
    ],
    scoreKind: 'winnings',
    meta: {
      subtitle: 'Топ-10 по выигрышам',
      scoreSuffix: 'бон.',
      emptyHint: 'Сыграйте первым и попадите в таблицу',
    },
  },
  color: {
    winCommentMarkers: ['Цветовом конфликте'],
    spendTxTypes: [
      'GAMES_COLOR_CONFLICT_START',
      'GAMES_COLOR_CONFLICT_EXTRA_START',
      'GAMES_COLOR_CONFLICT_ATTEMPT_PURCHASE',
    ],
    scoreKind: 'winnings',
    meta: {
      subtitle: 'Топ-10 по выигрышам',
      scoreSuffix: 'бон.',
      emptyHint: 'Сыграйте первым и попадите в таблицу',
    },
  },
  'quick-balance': {
    winCommentMarkers: ['Быстром балансе'],
    spendTxTypes: [
      'GAMES_QUICK_BALANCE_START',
      'GAMES_QUICK_BALANCE_EXTRA_START',
      'GAMES_QUICK_BALANCE_ATTEMPT_PURCHASE',
    ],
    scoreKind: 'winnings',
    meta: {
      subtitle: 'Топ-10 по выигрышам',
      scoreSuffix: 'бон.',
      emptyHint: 'Сыграйте первым и попадите в таблицу',
    },
  },
  'odd-number': {
    winCommentMarkers: ['Лишнем числе'],
    spendTxTypes: [
      'GAMES_ODD_NUMBER_SCHULTE_START',
      'GAMES_ODD_NUMBER_SCHULTE_EXTRA_START',
      'GAMES_ODD_NUMBER_SCHULTE_ATTEMPT_PURCHASE',
    ],
    scoreKind: 'winnings',
    meta: {
      subtitle: 'Топ-10 по выигрышам',
      scoreSuffix: 'бон.',
      emptyHint: 'Сыграйте первым и попадите в таблицу',
    },
  },
  generator: {
    winCommentMarkers: ['генератора бонусов', 'Начисление за запуск генератора'],
    spendTxTypes: ['GAMES_BONUS_GENERATOR_RUN'],
    scoreKind: 'winnings',
    meta: {
      subtitle: 'Топ-10 по выигрышам',
      scoreSuffix: 'бон.',
      emptyHint: 'Запустите генератор первым',
    },
  },
};

/** Маркеры комментариев игровых выигрышей (для ленты и глобального рейтинга). */
export const ALL_GAME_WIN_COMMENT_MARKERS = Array.from(
  new Set(
    Object.values(GAME_LEADERBOARD_CONFIG).flatMap((config) => config.winCommentMarkers),
  ),
);

/** Типы транзакций списания за игры (запуски и покупка попыток). */
export const ALL_GAME_SPEND_TX_TYPES = Array.from(
  new Set(
    Object.values(GAME_LEADERBOARD_CONFIG).flatMap((config) => config.spendTxTypes),
  ),
);

export function getGameLeaderboardMeta(gameId: GameLeaderboardId): GameLeaderboardMeta {
  return GAME_LEADERBOARD_CONFIG[gameId].meta;
}

interface ScoredUserRow {
  userId: string;
  score: number;
  winCount?: number;
}

async function attachUserProfiles(
  rows: ScoredUserRow[],
): Promise<GameLeaderboardEntry[]> {
  if (rows.length === 0) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: { id: { in: rows.map((row) => row.userId) } },
    select: { id: true, username: true, avatar: true },
  });
  const userMap = new Map(users.map((user) => [user.id, user]));

  return rows.map((row) => {
    const user = userMap.get(row.userId);

    return {
      id: row.userId,
      username: user?.username ?? null,
      avatar: user?.avatar ?? null,
      score: row.score,
      winCount: row.winCount,
    };
  });
}

async function getWinningsLeaderboard(
  config: GameLeaderboardConfig,
  limit: number,
): Promise<GameLeaderboardEntry[]> {
  const aggregates = await prisma.goodDeedBonusGrant.groupBy({
    by: ['userId'],
    where: {
      amountBonuses: { gt: 0 },
      OR: config.winCommentMarkers.map((marker) => ({
        comment: { contains: marker },
      })),
    },
    _sum: { amountBonuses: true },
    _count: { _all: true },
    orderBy: { _sum: { amountBonuses: 'desc' } },
    take: limit,
  });

  const rows = aggregates
    .map((row) => ({
      userId: row.userId,
      score: row._sum.amountBonuses ?? 0,
      winCount: row._count._all,
    }))
    .filter((row) => row.score > 0);

  return attachUserProfiles(rows);
}

function parseSequenceStepsFromComment(comment: string | null): number | null {
  if (!comment) {
    return null;
  }

  const match = comment.match(/\((\d+) шагов\)/);
  if (!match) {
    return null;
  }

  const steps = Number.parseInt(match[1], 10);
  return Number.isFinite(steps) ? steps : null;
}

async function getSequenceRecordLeaderboard(
  limit: number,
): Promise<GameLeaderboardEntry[]> {
  const [usersWithRecord, sequenceGrants] = await Promise.all([
    prisma.user.findMany({
      where: { maxSequenceRecord: { gt: 0 } },
      select: { id: true, maxSequenceRecord: true },
    }),
    prisma.goodDeedBonusGrant.findMany({
      where: {
        amountBonuses: { gt: 0 },
        comment: { contains: 'Секретную последовательность' },
      },
      select: { userId: true, comment: true },
    }),
  ]);

  const scoreByUser = new Map<string, number>();

  for (const user of usersWithRecord) {
    scoreByUser.set(user.id, user.maxSequenceRecord);
  }

  for (const grant of sequenceGrants) {
    const steps = parseSequenceStepsFromComment(grant.comment);
    if (!steps) {
      continue;
    }

    const current = scoreByUser.get(grant.userId) ?? 0;
    if (steps > current) {
      scoreByUser.set(grant.userId, steps);
    }
  }

  const rows = Array.from(scoreByUser.entries())
    .map(([userId, score]) => ({ userId, score }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  return attachUserProfiles(rows);
}

export async function getGameLeaderboard(
  gameId: GameLeaderboardId,
  limit = 10,
): Promise<GameLeaderboardEntry[]> {
  const config = GAME_LEADERBOARD_CONFIG[gameId];

  if (config.scoreKind === 'record') {
    return getSequenceRecordLeaderboard(limit);
  }

  return getWinningsLeaderboard(config, limit);
}

export interface GlobalGameLeaderboards {
  topWinners: GameLeaderboardEntry[];
  topLosers: GameLeaderboardEntry[];
}

export async function getGlobalGameLeaderboards(
  limit = 10,
): Promise<GlobalGameLeaderboards> {
  const [winAggregates, spendAggregates] = await Promise.all([
    prisma.goodDeedBonusGrant.groupBy({
      by: ['userId'],
      where: {
        amountBonuses: { gt: 0 },
        OR: ALL_GAME_WIN_COMMENT_MARKERS.map((marker) => ({
          comment: { contains: marker },
        })),
      },
      _sum: { amountBonuses: true },
      _count: { _all: true },
    }),
    prisma.bonusTransaction.groupBy({
      by: ['userId'],
      where: { type: { in: ALL_GAME_SPEND_TX_TYPES } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const winMap = new Map(
    winAggregates.map((row) => [
      row.userId,
      {
        totalWon: row._sum.amountBonuses ?? 0,
        winCount: row._count._all,
      },
    ]),
  );

  const topWinnerRows: ScoredUserRow[] = winAggregates
    .map((row) => ({
      userId: row.userId,
      score: row._sum.amountBonuses ?? 0,
      winCount: row._count._all,
    }))
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  const topLoserRows: ScoredUserRow[] = spendAggregates
    .map((row) => {
      const spent = row._sum.amount ?? 0;
      const won = winMap.get(row.userId)?.totalWon ?? 0;
      const netLoss = spent - won;

      return {
        userId: row.userId,
        score: netLoss,
        winCount: row._count._all,
      };
    })
    .filter((row) => row.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  const [topWinners, topLosers] = await Promise.all([
    attachUserProfiles(topWinnerRows),
    attachUserProfiles(topLoserRows),
  ]);

  return { topWinners, topLosers };
}
