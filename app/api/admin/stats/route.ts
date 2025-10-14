// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.uid || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    // Статистика по заявкам
    const [pending, approved, rejected, total, totalAmount] = await Promise.all([
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.application.count(),
      prisma.application
        .aggregate({
          _sum: { amount: true },
        })
        .then((r) => r._sum.amount || 0),
    ]);

    // Статистика по достижениям
    const [totalAchievements, activeAchievements, inactiveAchievements, exclusiveAchievements] = await Promise.all([
      prisma.achievement.count(),
      prisma.achievement.count({ where: { isActive: true } }),
      prisma.achievement.count({ where: { isActive: false } }),
      prisma.achievement.count({ where: { isExclusive: true } }),
    ]);

    // Статистика по пользователям
    const [totalUsers, adminUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'ADMIN' } }),
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
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Ошибка получения статистики' },
      { status: 500 }
    );
  }
}
