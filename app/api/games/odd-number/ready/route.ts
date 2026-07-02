import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { acknowledgeOddNumberReady } from '@/lib/games/oddNumberSchulte';

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

    const ready = await acknowledgeOddNumberReady(session.uid);

    if (!ready) {
      return Response.json(
        { error: 'Активная игровая сессия не найдена.' },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      data: ready,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/odd-number/ready]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
