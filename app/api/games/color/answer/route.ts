import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  COLOR_CONFLICT_COLOR_NAMES,
  submitColorConflictAnswer,
} from '@/lib/games/colorConflict';

/** Таймаут ответа проверяется в submitColorConflictAnswer с пинг-буфером +200 мс. */

const answerBodySchema = z.object({
  selectedAnswer: z
    .enum(COLOR_CONFLICT_COLOR_NAMES as [string, ...string[]])
    .nullable()
    .optional(),
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
        { error: 'Некорректный ответ. Укажите выбранный цвет.' },
        { status: 400 },
      );
    }

    const result = await submitColorConflictAnswer(
      session.uid,
      parsed.data.selectedAnswer ?? null,
    );

    return Response.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logRouteCatchError('[API POST /api/games/color/answer]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
