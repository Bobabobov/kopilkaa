import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { submitMathSprintAnswer } from '@/lib/games/mathSprint';

/** Таймаут ответа проверяется в submitMathSprintAnswer с пинг-буфером +200 мс. */

const answerBodySchema = z.object({
  selectedAnswer: z.number().int(),
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
    const parsed = answerBodySchema.safeParse(rawBody);

    if (!parsed.success) {
      return Response.json(
        { error: 'Некорректный ответ. Укажите выбранный вариант.' },
        { status: 400 },
      );
    }

    const result = await submitMathSprintAnswer(
      session.uid,
      parsed.data.selectedAnswer,
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/math/answer]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
