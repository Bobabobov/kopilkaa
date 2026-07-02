import {
  handleGamePurchaseAttemptRequest,
  parseJsonBody,
} from '@/lib/games/gamePurchaseAttemptRoute';
import {
  isColorConflictDifficulty,
  purchaseColorConflictAttempt,
} from '@/lib/games/colorConflict';

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  const difficulty =
    body &&
    typeof body === 'object' &&
    'difficulty' in body &&
    isColorConflictDifficulty((body as { difficulty: unknown }).difficulty)
      ? (body as { difficulty: import('@/lib/games/colorConflict').ColorConflictDifficulty })
          .difficulty
      : null;

  if (!difficulty) {
    return Response.json(
      { error: 'Укажите сложность: easy, medium или hard' },
      { status: 400 },
    );
  }

  return handleGamePurchaseAttemptRequest(
    request,
    '[API POST /api/games/color/purchase-attempt]',
    (userId) => purchaseColorConflictAttempt(userId, difficulty),
  );
}
