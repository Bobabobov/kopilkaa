import {
  handleGamePurchaseAttemptRequest,
  parseJsonBody,
} from '@/lib/games/gamePurchaseAttemptRoute';
import {
  isMathSprintDifficulty,
  purchaseMathSprintAttempt,
} from '@/lib/games/mathSprint';

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  const difficulty =
    body &&
    typeof body === 'object' &&
    'difficulty' in body &&
    isMathSprintDifficulty((body as { difficulty: unknown }).difficulty)
      ? (body as { difficulty: import('@/lib/games/mathSprint').MathSprintDifficulty })
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
    '[API POST /api/games/math/purchase-attempt]',
    (userId) => purchaseMathSprintAttempt(userId, difficulty),
  );
}
