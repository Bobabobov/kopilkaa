import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  DailyQuestRerollCompletedQuestError,
  DailyQuestRerollInvalidQuestError,
  DailyQuestRerollLimitError,
  getDailyQuestsForUser,
  rerollDailyQuest,
} from '@/lib/games/quests';

export async function GET(request: Request) {
  try {
    const session = await getAuthUser(request);

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quests = await getDailyQuestsForUser(session.uid);

    return Response.json({
      success: true,
      data: quests,
    });
  } catch (error) {
    logRouteCatchError('[API GET /api/games/daily-quests]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthUser(request);

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await request.json().catch(() => null);
    const questId =
      rawBody && typeof rawBody === 'object' && 'questId' in rawBody
        ? Number((rawBody as { questId: unknown }).questId)
        : NaN;

    if (![1, 2, 3].includes(questId)) {
      return Response.json({ error: 'Укажите корректный id задания (1-3).' }, { status: 400 });
    }

    const data = await rerollDailyQuest(session.uid, questId as 1 | 2 | 3);

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    if (error instanceof DailyQuestRerollLimitError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof DailyQuestRerollInvalidQuestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof DailyQuestRerollCompletedQuestError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    logRouteCatchError('[API POST /api/games/daily-quests]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
