import { prisma } from '@/lib/db';
import { ALL_GAME_WIN_COMMENT_MARKERS } from '@/lib/games/leaderboard';

export interface GameLiveWinEntry {
  id: string;
  username: string;
  amount: number;
  gameName: string;
  createdAt: string;
}

const GAME_WIN_COMMENT_MARKERS: Array<{ marker: string; gameName: string }> = [
  { marker: 'математическом спринте', gameName: 'Математический спринт' },
  { marker: 'генератора бонусов', gameName: 'Генератор бонусов' },
  { marker: 'Начисление за запуск генератора', gameName: 'Генератор бонусов' },
  { marker: 'Секретную последовательность', gameName: 'Секретная последовательность' },
  { marker: 'Цветовом конфликте', gameName: 'Цветовой конфликт' },
  { marker: 'Лишнем числе', gameName: 'Лишнее число' },
  { marker: 'Быстром балансе', gameName: 'Быстрый баланс' },
];

const LIVE_HISTORY_MARKERS = Array.from(
  new Set([
    ...ALL_GAME_WIN_COMMENT_MARKERS,
    ...GAME_WIN_COMMENT_MARKERS.map((item) => item.marker),
  ]),
);

function mapGrantCommentToGameName(comment: string | null): string | null {
  if (!comment) {
    return null;
  }

  const match = GAME_WIN_COMMENT_MARKERS.find((item) =>
    comment.includes(item.marker),
  );

  return match?.gameName ?? null;
}

/**
 * Игровые выигрыши начисляются через GoodDeedBonusGrant; BonusTransaction
 * хранит списания за запуск. Для ленты берём последние игровые начисления.
 */
export async function getGameLiveWinHistory(
  limit = 5,
): Promise<GameLiveWinEntry[]> {
  const grants = await prisma.goodDeedBonusGrant.findMany({
    where: {
      amountBonuses: { gt: 0 },
      OR: LIVE_HISTORY_MARKERS.map((marker) => ({
        comment: { contains: marker },
      })),
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      amountBonuses: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          username: true,
          name: true,
        },
      },
    },
  });

  return grants
    .map((grant) => {
      const gameName = mapGrantCommentToGameName(grant.comment);

      if (!gameName) {
        return null;
      }

      return {
        id: grant.id,
        username: grant.user.username ?? grant.user.name ?? 'Игрок',
        amount: grant.amountBonuses,
        gameName,
        createdAt: grant.createdAt.toISOString(),
      };
    })
    .filter((entry): entry is GameLiveWinEntry => entry !== null);
}
