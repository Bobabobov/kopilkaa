import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  OddNumberDailyLimitError,
  OddNumberInsufficientBalanceError,
  startOddNumberGame,
  TIME_LIMIT_MS,
} from '@/lib/games/oddNumberSchulte';

export async function POST(request: Request) {
  try {
    const session = await getAuthUser(request);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banStatus = await checkUserBan(session.uid);
    if (banStatus.isBanned) {
      return Response.json(
        {
          error: 'Banned',
          banned: true,
          banInfo: {
            reason: banStatus.bannedReason,
            until: banStatus.bannedUntil?.toISOString() ?? null,
            isPermanent: banStatus.isPermanent,
          },
        },
        { status: 403 },
      );
    }

    const data = await startOddNumberGame(session.uid);

    return Response.json({
      success: true,
      data: {
        cells: data.cells,
        timeLimitMs: TIME_LIMIT_MS,
        balanceAfter: data.balanceAfter,
        serverStartTime: data.serverStartTime,
        dailyAttemptsUsed: data.dailyAttemptsUsed,
        dailyAttemptsLeft: data.dailyAttemptsLeft,
        purchasedAttemptsAvailable: data.purchasedAttemptsAvailable,
      },
    });
  } catch (error) {
    if (error instanceof OddNumberInsufficientBalanceError) {
      return Response.json(
        { error: 'Недостаточно бонусов для запуска игры' },
        { status: 400 },
      );
    }

    if (error instanceof OddNumberDailyLimitError) {
      return Response.json(
        { error: 'Достигнут суточный лимит попыток (10 в день)' },
        { status: 429 },
      );
    }

    logRouteCatchError('[API POST /api/games/odd-number/start]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
