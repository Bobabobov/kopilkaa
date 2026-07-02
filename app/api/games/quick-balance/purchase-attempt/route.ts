import { handleGamePurchaseAttemptRequest } from '@/lib/games/gamePurchaseAttemptRoute';
import { purchaseQuickBalanceAttempt } from '@/lib/games/quickBalance';

export async function POST(request: Request) {
  return handleGamePurchaseAttemptRequest(
    request,
    '[API POST /api/games/quick-balance/purchase-attempt]',
    purchaseQuickBalanceAttempt,
  );
}
