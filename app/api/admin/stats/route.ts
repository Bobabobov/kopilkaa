// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { getAdminDashboardCounts } from "@/lib/admin/dashboardStats";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    // Статистика по заявкам с обработкой ошибок
    const [pending, approved, rejected, total, totalAmount, dashboard] =
      await Promise.all([
        prisma.application
          .count({ where: { status: "PENDING" } })
          .catch(() => 0),
        prisma.application
          .count({ where: { status: "APPROVED" } })
          .catch(() => 0),
        prisma.application
          .count({ where: { status: "REJECTED" } })
          .catch(() => 0),
        prisma.application.count().catch(() => 0),
        prisma.application
          .aggregate({
            _sum: { amount: true },
          })
          .then((r) => r._sum.amount || 0)
          .catch(() => 0),
        getAdminDashboardCounts().catch(() => ({
          applicationsPending: 0,
          feedbackNew: 0,
          goodDeedsPending: 0,
          withdrawalsPending: 0,
          adRequestsNew: 0,
        })),
      ]);

    // Статистика по пользователям с обработкой ошибок
    const [totalUsers, adminUsers] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.user.count({ where: { role: "ADMIN" } }).catch(() => 0),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          applications: {
            pending,
            approved,
            rejected,
            total,
            totalAmount,
          },
          users: {
            total: totalUsers,
            admins: adminUsers,
          },
          dashboard,
        },
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Ошибка получения статистики" },
      { status: 500 },
    );
  }
}
