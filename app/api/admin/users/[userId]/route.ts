import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { buildAdminUserDetail } from '@/lib/admin/buildAdminUserDetail';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
  }

  try {
    const { userId } = await params;
    const item = await buildAdminUserDetail(userId);

    if (!item) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('[admin users GET]', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
