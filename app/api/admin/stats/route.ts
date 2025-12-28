// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { getAllowedAdminUser } from '@/lib/adminAccess';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // Статистика по заявкам с обработкой ошибок
    const [pending, approved, rejected, total, totalAmount] = await Promise.all([
      prisma.application.count({ where: { status: "PENDING" } }).catch(() => 0),
      prisma.application.count({ where: { status: "APPROVED" } }).catch(() => 0),
      prisma.application.count({ where: { status: "REJECTED" } }).catch(() => 0),
      prisma.application.count().catch(() => 0),
      prisma.application
        .aggregate({
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0)
        .catch(() => 0),
    ]);

    // Статистика по достижениям с обработкой ошибок
    const [totalAchievements, activeAchievements, inactiveAchievements, exclusiveAchievements] = await Promise.all([
      prisma.achievement.count().catch(() => 0),
      prisma.achievement.count({ where: { isActive: true } }).catch(() => 0),
      prisma.achievement.count({ where: { isActive: false } }).catch(() => 0),
      prisma.achievement.count({ where: { isExclusive: true } }).catch(() => 0),
    ]);

    // Статистика по пользователям с обработкой ошибок
    const [totalUsers, adminUsers] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.user.count({ where: { role: 'ADMIN' } }).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        applications: {
          pending,
          approved,
          rejected,
          total,
          totalAmount,
        },
        achievements: {
          total: totalAchievements,
          active: activeAchievements,
          inactive: inactiveAchievements,
          exclusive: exclusiveAchievements,
        },
        users: {
          total: totalUsers,
          admins: adminUsers,
        },
      },
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    );
  }
}
