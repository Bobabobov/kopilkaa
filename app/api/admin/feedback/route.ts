import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { logRouteCatchError } from '@/lib/api/parseApiError';
import { parseFeedbackImageUrls } from '@/lib/feedback/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const topic = searchParams.get('topic');
    const q = searchParams.get('q')?.trim();

    const items = await prisma.siteFeedback.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status } : {}),
        ...(topic && topic !== 'ALL' ? { topic } : {}),
        ...(q
          ? {
              OR: [
                { message: { contains: q } },
                { topicLabel: { contains: q } },
                { pagePath: { contains: q } },
                { adminNote: { contains: q } },
                {
                  user: {
                    OR: [
                      { name: { contains: q } },
                      { username: { contains: q } },
                      { email: { contains: q } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ createdAt: 'desc' }],
      take: 200,
      select: {
        id: true,
        rating: true,
        message: true,
        source: true,
        topic: true,
        topicLabel: true,
        pagePath: true,
        status: true,
        adminNote: true,
        imageUrls: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    const stats = await prisma.siteFeedback.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    return NextResponse.json({
      success: true,
      data: {
        items: items.map((item) => ({
          ...item,
          imageUrls: parseFeedbackImageUrls(item.imageUrls),
        })),
        stats: {
          new: stats.find((s) => s.status === 'new')?._count._all ?? 0,
          read: stats.find((s) => s.status === 'read')?._count._all ?? 0,
          resolved: stats.find((s) => s.status === 'resolved')?._count._all ?? 0,
        },
      },
    });
  } catch (error) {
    logRouteCatchError('[API Error] GET /api/admin/feedback', error);
    return NextResponse.json(
      { error: 'Не удалось загрузить отзывы' },
      { status: 500 },
    );
  }
}
