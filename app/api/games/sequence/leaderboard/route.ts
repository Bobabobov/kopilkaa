import { logRouteCatchError } from '@/lib/api/parseApiError';
import { getGameLeaderboard } from '@/lib/games/leaderboard';

export async function GET() {
  try {
    const leaderboard = await getGameLeaderboard('sequence');

    return Response.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logRouteCatchError('[API GET /api/games/sequence/leaderboard]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
