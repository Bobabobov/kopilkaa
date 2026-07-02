import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  BonusGeneratorInsufficientBalanceError,
  runBonusGeneratorForUser,
} from '@/lib/games/bonusGenerator';

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

    const result = await runBonusGeneratorForUser(session.uid);

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof BonusGeneratorInsufficientBalanceError) {
      return Response.json(
        { error: 'Недостаточно бонусов для запуска генератора' },
        { status: 400 },
      );
    }

    logRouteCatchError('[API POST /api/games/generator/run]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
