// app/api/users/[userId]/activity/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId } = await params;

    // Проверяем, что пользователь существует
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    // Получаем последние заявки пользователя
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    // Формируем активность
    const activities = [
      ...applications.map((app) => ({
        id: `app_${app.id}`,
        type: "application_created",
        description: `Создал заявку "${app.title}"`,
        createdAt: app.createdAt,
      })),
    ];

    // Сортируем по дате и берем последние 5
    activities.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const recentActivities = activities.slice(0, 5);

    return NextResponse.json({ activities: recentActivities });
  } catch (error) {
    console.error("Get user activity error:", error);
    return NextResponse.json(
      { message: "Ошибка получения активности" },
      { status: 500 },
    );
  }
}
