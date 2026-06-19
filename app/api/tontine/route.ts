import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { getTontineStatus } from '@/lib/tontine/service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthUser(request);
    const data = await getTontineStatus(session?.uid ?? null);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logRouteCatchError('[API Error] GET /api/tontine', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить состояние игры' },
      { status: 500 },
    );
  }
}
