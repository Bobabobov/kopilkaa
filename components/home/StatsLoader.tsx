// Server component для загрузки статистики
import { cache } from "react";
import { prisma } from "@/lib/db";

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

// Используем React cache для дедупликации запросов в рамках одного рендера
// И напрямую обращаемся к БД для лучшей производительности
const getStats = cache(async (): Promise<Stats> => {
  try {
    // Получаем статистику напрямую из БД (быстрее чем через API)
    const [applicationsStats, totalUsers, donations] = await Promise.all([
      prisma.application.groupBy({
        by: ["status"],
        _count: { status: true },
      }).catch(() => []),
      prisma.user.count().catch(() => 0),
      prisma.donation.findMany({
        select: { type: true, amount: true },
      }).catch(() => []),
    ]);

    const totalSupport = donations
      .filter((d) => d.type === "SUPPORT")
      .reduce((sum, d) => sum + d.amount, 0);

    const totalPayout = donations
      .filter((d) => d.type === "PAYOUT")
      .reduce((sum, d) => sum + d.amount, 0);

    const totalAdjust = donations
      .filter((d) => d.type === "ADJUST")
      .reduce((sum, d) => sum + d.amount, 0);

    const balance = totalSupport - totalPayout + totalAdjust;

    const totalApplications = applicationsStats.reduce(
      (acc, item) => acc + item._count.status,
      0
    );

    const approvedApplications =
      applicationsStats.find((item) => item.status === "APPROVED")?._count.status || 0;

    return {
      collected: balance,
      requests: totalApplications,
      approved: approvedApplications,
      people: totalUsers,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { collected: 0, requests: 0, approved: 0, people: 0 };
  }
});

export default async function StatsLoader() {
  const stats = await getStats();
  return stats;
}
