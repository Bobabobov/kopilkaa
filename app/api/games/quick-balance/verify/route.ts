import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { verifyQuickBalanceChoices } from '@/lib/games/quickBalance';

const comparisonSchema = z.enum(['lt', 'eq', 'gt']);

const verifyBodySchema = z.object({
  choices: z.array(comparisonSchema).max(3),
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
        { error: 'Некорректный набор ответов (lt, eq, gt).' },
        { status: 400 },
      );
    }

    const result = await verifyQuickBalanceChoices(
      session.uid,
      parsed.data.choices,
      parsed.data.timedOut ?? false,
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/quick-balance/verify]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
