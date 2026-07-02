import { logRouteCatchError } from '@/lib/api/parseApiError';
import { getGameLiveWinHistory } from '@/lib/games/liveHistory';

export async function GET() {
  try {
    const history = await getGameLiveWinHistory(5);

    return Response.json({
      success: true,
      data: history,
    });
  } catch (error) {
    logRouteCatchError('[API GET /api/games/live-history]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
