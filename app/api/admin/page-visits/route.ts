// app/api/admin/page-visits/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return Response.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "/applications";
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Получаем статистику времени на странице
    const stats = await prisma.pageVisit.aggregate({
      where: {
        page,
        visitDate: {
          gte: startDate,
        },
      },
      _sum: {
        timeSpent: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        timeSpent: true,
      },
    });

    // Получаем детальную статистику по пользователям
    const userStats = await prisma.pageVisit.groupBy({
      by: ["userId"],
      where: {
        page,
        visitDate: {
          gte: startDate,
        },
      },
      _sum: {
        timeSpent: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          timeSpent: "desc",
        },
      },
      take: 20, // Топ 20 пользователей
    });

    // Получаем информацию о пользователях
    const userIds = userStats.map((stat) => stat.userId);
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    const userStatsWithInfo = userStats.map((stat) => {
      const user = users.find((u) => u.id === stat.userId);
      return {
        ...stat,
        user: user || {
          id: stat.userId,
          name: null,
          email: "Неизвестный",
          avatar: null,
        },
      };
    });

    // Получаем статистику по дням (упрощенная версия)
    const dailyVisits = await prisma.pageVisit.findMany({
      where: {
        page,
        visitDate: {
          gte: startDate,
        },
      },
      select: {
        visitDate: true,
        timeSpent: true,
      },
      orderBy: { visitDate: "desc" },
    });

    // Группируем по дням
    const dailyStats = dailyVisits.reduce(
      (acc, visit) => {
        const date = visit.visitDate.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = { visits: 0, totalTime: 0, times: [] };
        }
        acc[date].visits++;
        acc[date].totalTime += visit.timeSpent;
        acc[date].times.push(visit.timeSpent);
        return acc;
      },
      {} as Record<
        string,
        { visits: number; totalTime: number; times: number[] }
      >,
    );

    const dailyStatsArray = Object.entries(dailyStats).map(([date, data]) => ({
      date,
      visits: data.visits,
      totalTime: data.totalTime,
      avgTime: data.times.reduce((a, b) => a + b, 0) / data.times.length,
    }));

    return Response.json({
      page,
      period: `${days} дней`,
      totalTime: stats._sum.timeSpent || 0,
      totalVisits: stats._count.id || 0,
      averageTime: stats._avg.timeSpent || 0,
      userStats: userStatsWithInfo,
      dailyStats: dailyStatsArray,
    });
  } catch (error) {
    console.error("Ошибка получения статистики времени:", error);
    return Response.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
