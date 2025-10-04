import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Получаем статистику по заявкам
    const applicationsStats = await prisma.application.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Получаем общее количество пользователей
    const totalUsers = await prisma.user.count();

    // Получаем количество новых пользователей за последние 7 дней
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Формируем статистику
    const stats = {
      applications: {
        total: applicationsStats.reduce((acc, item) => acc + item._count.status, 0),
        pending: applicationsStats.find(item => item.status === "PENDING")?._count.status || 0,
        approved: applicationsStats.find(item => item.status === "APPROVED")?._count.status || 0,
        rejected: applicationsStats.find(item => item.status === "REJECTED")?._count.status || 0,
      },
      users: {
        total: totalUsers,
        new: newUsers
      }
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}





























