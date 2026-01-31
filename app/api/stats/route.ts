import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Получаем статистику по заявкам
    const applicationsStats = await prisma.application
      .groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      })
      .catch(() => []);

    // Получаем общее количество пользователей
    const totalUsers = await prisma.user.count().catch(() => 0);

    // Получаем количество новых пользователей за последние 7 дней
    const newUsers = await prisma.user
      .count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      })
      .catch(() => 0);

    // Получаем статистику по донатам/копилке
    const donations = await prisma.donation
      .findMany({
        select: {
          type: true,
          amount: true,
        },
      })
      .catch(() => []);

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

    // Формируем статистику
    const stats = {
      applications: {
        total: applicationsStats.reduce(
          (acc, item) => acc + item._count.status,
          0,
        ),
        pending:
          applicationsStats.find((item) => item.status === "PENDING")?._count
            .status || 0,
        approved:
          applicationsStats.find((item) => item.status === "APPROVED")?._count
            .status || 0,
        rejected:
          applicationsStats.find((item) => item.status === "REJECTED")?._count
            .status || 0,
      },
      users: {
        total: totalUsers,
        new: newUsers,
      },
      donations: {
        totalIn: totalSupport,
        totalOut: totalPayout,
        adjust: totalAdjust,
        balance,
      },
    };

    return NextResponse.json(
      { stats },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Возвращаем пустую статистику вместо ошибки
    return NextResponse.json({
      stats: {
        applications: {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        },
        users: {
          total: 0,
          new: 0,
        },
      },
    });
  }
}
