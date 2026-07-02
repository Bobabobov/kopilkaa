import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { GRID_BUTTON_COUNT, verifySequenceClicks } from '@/lib/games/sequenceGame';

const verifyBodySchema = z.object({
  clicks: z.array(z.number().int().min(0).max(GRID_BUTTON_COUNT - 1)),
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
    const parsed = verifyBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return Response.json(
        { error: 'Некорректный массив кликов. Ожидаются индексы 0–8.' },
        { status: 400 },
      );
    }

    const result = await verifySequenceClicks(session.uid, parsed.data.clicks);

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/sequence/verify]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
