import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  joinTontineRound,
  TontineAlreadyJoinedError,
  TontineRoundClosedError,
} from '@/lib/tontine/service';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: { isBanned: true },
    });

    if (user?.isBanned) {
      return NextResponse.json(
        { error: 'Заблокированные пользователи не могут участвовать в игре' },
        { status: 403 },
      );
    }

    const data = await joinTontineRound(session.uid);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof TontineAlreadyJoinedError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof TontineRoundClosedError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logRouteCatchError('[API Error] POST /api/tontine/join', error);
    return NextResponse.json(
      { error: 'Не удалось вступить в игру' },
      { status: 500 },
    );
  }
}
