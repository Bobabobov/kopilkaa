import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { getGoodDeedSubmissionStats } from '@/lib/admin/goodDeedSubmissions';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const stats = await getGoodDeedSubmissionStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('[API Error] GET /api/admin/good-deeds/submissions/stats', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить статистику' },
      { status: 500 },
    );
  }
}
