import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { getUserLevelProgress } from '@/lib/userLevel';
import { toDisplayExperience } from '@/lib/userLevel/economy';
import {
  InsufficientBonusesError,
  InvestBonusesInvalidAmountError,
  investBonusesInExperience,
} from '@/lib/userLevel/investBonusesInExperience';

export const dynamic = 'force-dynamic';

const investSchema = z.object({
  amountBonuses: z.number().int().positive().optional(),
  investAll: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const parsed = investSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Некорректные данные запроса' },
        { status: 400 },
      );
    }

    const { amountBonuses, investAll } = parsed.data;

    if (!investAll && amountBonuses == null) {
      return NextResponse.json(
        { error: 'Укажите количество бонусов или investAll: true' },
        { status: 400 },
      );
    }

    let amount = amountBonuses ?? 0;

    if (investAll) {
      const { computeGoodDeedBonusWallet } = await import(
        '@/lib/goodDeedBonusWallet'
      );
      const wallet = await computeGoodDeedBonusWallet(session.uid);
      amount = wallet.availableBonuses;
    }

    if (amount < 1) {
      return NextResponse.json(
        { error: 'Нет бонусов для вложения в опыт' },
        { status: 400 },
      );
    }

    const result = await investBonusesInExperience(session.uid, amount);

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        userLevel: getUserLevelProgress(result.experience),
      },
    });
  } catch (error) {
    if (error instanceof InvestBonusesInvalidAmountError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof InsufficientBonusesError) {
      return NextResponse.json(
        {
          error: error.message,
          availableBonuses: error.available,
        },
        { status: 400 },
      );
    }

    logRouteCatchError('[API Error] POST /api/profile/bonuses/invest', error);
    return NextResponse.json(
      { error: 'Не удалось вложить бонусы в опыт' },
      { status: 500 },
    );
  }
}
