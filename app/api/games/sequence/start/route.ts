import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  SequenceDailyLimitError,
  SequenceInsufficientBalanceError,
  startSequenceGame,
} from '@/lib/games/sequenceGame';

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

    const data = await startSequenceGame(session.uid);

    return Response.json({
      success: true,
      data: {
        sequence: data.sequence,
        currentRound: data.currentRound,
        serverStartTime: data.serverStartTime,
        timeLimitMs: data.timeLimitMs,
        balanceAfter: data.balanceAfter,
        maxSequenceRecord: data.maxSequenceRecord,
        dailyAttemptsUsed: data.dailyAttemptsUsed,
        dailyAttemptsLeft: data.dailyAttemptsLeft,
        purchasedAttemptsAvailable: data.purchasedAttemptsAvailable,
      },
    });
  } catch (error) {
    if (error instanceof SequenceInsufficientBalanceError) {
      return Response.json(
        { error: 'Недостаточно бонусов для запуска игры' },
        { status: 400 },
      );
    }

    if (error instanceof SequenceDailyLimitError) {
      return Response.json(
        { error: 'Достигнут суточный лимит попыток (10 в день)' },
        { status: 429 },
      );
    }

    logRouteCatchError('[API POST /api/games/sequence/start]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
