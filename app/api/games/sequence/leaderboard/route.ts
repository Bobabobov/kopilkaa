import { logRouteCatchError } from '@/lib/api/parseApiError';
import { getSequenceLeaderboard } from '@/lib/games/sequenceGame';

export async function GET() {
  try {
    const leaderboard = await getSequenceLeaderboard();

    return Response.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    logRouteCatchError('[API GET /api/games/sequence/leaderboard]', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
