import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  GRID_CELL_COUNT,
  verifySchulteClicks,
} from '@/lib/games/oddNumberSchulte';

const verifyBodySchema = z.object({
  clicks: z.array(z.number().int().min(0).max(GRID_CELL_COUNT - 1)),
  timedOut: z.boolean().optional(),
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
        { error: 'Некорректный массив кликов. Ожидаются индексы 0–15.' },
        { status: 400 },
      );
    }

    const result = await verifySchulteClicks(
      session.uid,
      parsed.data.clicks,
      parsed.data.timedOut ?? false,
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/odd-number/answer]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
