import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import {
  checkInTontine,
  TontineAlreadyCheckedInError,
  TontineEliminatedError,
  TontineNotParticipantError,
} from '@/lib/tontine/service';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    if (!session?.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await checkInTontine(session.uid);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof TontineAlreadyCheckedInError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof TontineNotParticipantError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof TontineEliminatedError) {
      return NextResponse.json({ error: error.message }, { status: 410 });
    }

    logRouteCatchError('[API Error] POST /api/tontine/check-in', error);
    return NextResponse.json(
      { error: 'Не удалось отметиться' },
      { status: 500 },
    );
  }
}
