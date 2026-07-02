import { handleGamePurchaseAttemptRequest } from '@/lib/games/gamePurchaseAttemptRoute';
import { purchaseSequenceAttempt } from '@/lib/games/sequenceGame';

export async function POST(request: Request) {
  return handleGamePurchaseAttemptRequest(
    request,
    '[API POST /api/games/sequence/purchase-attempt]',
    purchaseSequenceAttempt,
  );
}
