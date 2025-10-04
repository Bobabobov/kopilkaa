// app/api/page-visits/stats/route.ts
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
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

    return Response.json({
      page,
      period: `${days} дней`,
      totalTime: stats._sum.timeSpent || 0,
      totalVisits: stats._count.id || 0,
      averageTime: stats._avg.timeSpent || 0,
    });
  } catch (error) {
    console.error("Ошибка получения статистики времени:", error);
    return Response.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}
