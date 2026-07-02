import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  FIRST_WITHDRAWAL_BONUS_AMOUNT,
  claimFirstWithdrawalBonus,
} from '@/lib/bonusWithdrawals/firstWithdrawalBonus';
import { computeGoodDeedBonusWallet } from '@/lib/goodDeedBonusWallet';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: 'Требуется вход' }, { status: 401 });
    }

    const result = await claimFirstWithdrawalBonus(session.uid);

    if (!result.claimed) {
      return NextResponse.json(
        {
          error:
            'Подарок недоступен. Нужен одобренный первый вывод и 3+ уровень профиля.',
        },
        { status: 400 },
      );
    }

    const wallet = await computeGoodDeedBonusWallet(session.uid);

    return NextResponse.json({
      success: true,
      data: {
        claimedBonuses: result.amount ?? FIRST_WITHDRAWAL_BONUS_AMOUNT,
        availableBonuses: wallet.availableBonuses,
        firstWithdrawalBonus: wallet.firstWithdrawalBonus,
      },
    });
  } catch (error) {
    logRouteCatchError(
      '[API Error] POST /api/profile/bonuses/first-withdrawal-reward',
      error,
    );
    return NextResponse.json(
      { error: 'Не удалось забрать подарок' },
      { status: 500 },
    );
  }
}
