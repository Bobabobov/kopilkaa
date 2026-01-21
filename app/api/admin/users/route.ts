// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { ApplicationStatus } from "@prisma/client";
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';
import { getTrustLevelFromEffectiveApproved } from "@/lib/trustLevel";

export const dynamic = 'force-dynamic';

// GET /api/admin/users - получить список пользователей для админа
export async function GET(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 20)));
    const q = (searchParams.get("q") || "").trim();

    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { email: { contains: q } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          lastSeen: true,
          role: true,
          trustDelta: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const userIds = users.map((user) => user.id);
    const effectiveGroups = userIds.length
      ? await prisma.application
          .groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.APPROVED,
              countTowardsTrust: true,
            },
            _count: { _all: true },
          })
          .catch(() => [])
      : [];

    const effectiveMap = new Map<string, number>();
    effectiveGroups.forEach((group: any) => {
      effectiveMap.set(group.userId, group._count?._all ?? 0);
    });

    const usersWithTrust = users.map((user) => {
      const effectiveApprovedApplications = effectiveMap.get(user.id) ?? 0;
      const trustDelta = user.trustDelta ?? 0;
      return {
        ...user,
        effectiveApprovedApplications,
        trustLevel: getTrustLevelFromEffectiveApproved(
          effectiveApprovedApplications,
          trustDelta,
        ),
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithTrust,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка получения списка пользователей' },
      { status: 500 }
    );
  }
}
