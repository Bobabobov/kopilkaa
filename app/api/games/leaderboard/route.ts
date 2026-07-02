import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  getGameLeaderboard,
  getGlobalGameLeaderboards,
  isGameLeaderboardId,
} from '@/lib/games/leaderboard';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');

    if (scope === 'global') {
      const leaderboards = await getGlobalGameLeaderboards();

      return Response.json({
        success: true,
        data: leaderboards,
      });
    }

    const gameId = searchParams.get('game');

    if (!gameId || !isGameLeaderboardId(gameId)) {
      return Response.json(
        { error: 'Укажите корректный параметр game' },
        { status: 400 },
      );
    }

    const leaderboard = await getGameLeaderboard(gameId);

    return Response.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logRouteCatchError('[API GET /api/games/leaderboard]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
