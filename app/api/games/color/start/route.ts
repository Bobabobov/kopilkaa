import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  ColorConflictDailyLimitError,
  ColorConflictInsufficientBalanceError,
  startColorConflictGame,
} from '@/lib/games/colorConflict';

const startBodySchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

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

    const rawBody = await request.json().catch(() => null);
    const parsed = startBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return Response.json(
        { error: 'Некорректный уровень сложности.' },
        { status: 400 },
      );
    }

    const data = await startColorConflictGame(session.uid, parsed.data.difficulty);

    return Response.json({
      success: true,
      data: {
        difficulty: data.difficulty,
        wordText: data.wordText,
        displayColorHex: data.displayColorHex,
        displayGlowRgb: data.displayGlowRgb,
        options: data.options,
        timeLimitMs: data.timeLimitMs,
        seriesTarget: data.seriesTarget,
        currentRound: data.currentRound,
        balanceAfter: data.balanceAfter,
        serverStartTime: data.serverStartTime,
        dailyAttemptsUsed: data.dailyAttemptsUsed,
        dailyAttemptsLeft: data.dailyAttemptsLeft,
        purchasedAttemptsAvailable: data.purchasedAttemptsAvailable,
      },
    });
  } catch (error) {
    if (error instanceof ColorConflictInsufficientBalanceError) {
      return Response.json(
        { error: 'Недостаточно бонусов для запуска игры' },
        { status: 400 },
      );
    }

    if (error instanceof ColorConflictDailyLimitError) {
      return Response.json(
        { error: 'Достигнут суточный лимит попыток (10 в день)' },
        { status: 429 },
      );
    }

    logRouteCatchError('[API POST /api/games/color/start]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
