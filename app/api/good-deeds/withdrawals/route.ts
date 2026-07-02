import { NextRequest, NextResponse } from 'next/server';

import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  BonusWithdrawalPendingError,
  BonusWithdrawalValidationError,
  createBonusWithdrawalRequest,
} from '@/lib/bonusWithdrawals/createBonusWithdrawalRequest';
import { parseBonusWithdrawalBody } from '@/lib/bonusWithdrawals/validateWithdrawalInput';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthUser(req);
    if (!session?.uid) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const parsed = parseBonusWithdrawalBody(body);

    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const created = await createBonusWithdrawalRequest(
      session.uid,
      parsed.data,
    );

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        amountBonuses: created.amountBonuses,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof BonusWithdrawalValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof BonusWithdrawalPendingError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    logRouteCatchError('[API Error] POST /api/good-deeds/withdrawals', error);
    return NextResponse.json(
      { error: 'Не удалось отправить запрос на вывод гонорара' },
      { status: 500 },
    );
  }
}
