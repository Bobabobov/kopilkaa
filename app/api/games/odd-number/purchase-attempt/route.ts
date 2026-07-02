import { handleGamePurchaseAttemptRequest } from '@/lib/games/gamePurchaseAttemptRoute';
import { purchaseOddNumberAttempt } from '@/lib/games/oddNumberSchulte';

export async function POST(request: Request) {
  return handleGamePurchaseAttemptRequest(
    request,
    '[API POST /api/games/odd-number/purchase-attempt]',
    purchaseOddNumberAttempt,
  );
}
