import { NextRequest, NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { updateSiteFeedbackStatusSchema } from '@/lib/feedback/validation';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const parsed = updateSiteFeedbackStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Некорректные данные' },
        { status: 400 },
      );
    }

    const existing = await prisma.siteFeedback.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: 'Отзыв не найден' }, { status: 404 });
    }

    const updated = await prisma.siteFeedback.update({
      where: { id },
      data: {
        status: parsed.data.status,
        adminNote: parsed.data.adminNote ?? undefined,
        processedBy: admin.id,
      },
      select: {
        id: true,
        status: true,
        adminNote: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    logRouteCatchError('[API Error] PATCH /api/admin/feedback/[id]', error);
    return NextResponse.json(
      { error: 'Не удалось обновить отзыв' },
      { status: 500 },
    );
  }
}
