import { getAuthUser } from '@/lib/auth';
import { checkUserBan } from '@/lib/ban-check';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  GameAttemptPurchaseDailyLimitError,
  GameAttemptPurchaseInsufficientBalanceError,
  type GameAttemptPurchaseResult,
} from '@/lib/games/gameAttemptPurchases';

export async function handleGamePurchaseAttemptRequest(
  request: Request,
  routeLabel: string,
  purchaseAttempt: (userId: string) => Promise<GameAttemptPurchaseResult>,
): Promise<Response> {
  try {
    const session = await getAuthUser(request);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banStatus = await checkUserBan(session.uid);
    if (banStatus.isBanned) {
      return Response.json(
        {
          error: 'Banned',
          banned: true,
          banInfo: {
            reason: banStatus.bannedReason,
            until: banStatus.bannedUntil?.toISOString() ?? null,
            isPermanent: banStatus.isPermanent,
          },
        },
        { status: 403 },
      );
    }

    const data = await purchaseAttempt(session.uid);

    return Response.json({
      success: true,
      data: {
        balanceAfter: data.balanceAfter,
        purchasedAttemptsAvailable: data.purchasedAttemptsAvailable,
        dailyAttemptPurchasesUsed: data.dailyAttemptPurchasesUsed,
        dailyAttemptPurchasesRemaining: data.dailyAttemptPurchasesRemaining,
        cost: data.cost,
      },
    });
  } catch (error) {
    if (error instanceof GameAttemptPurchaseInsufficientBalanceError) {
      return Response.json(
        { error: error.message },
        { status: 400 },
      );
    }

    if (error instanceof GameAttemptPurchaseDailyLimitError) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    logRouteCatchError(routeLabel, error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  return request.json().catch(() => null);
}
