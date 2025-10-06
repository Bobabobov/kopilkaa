// app/api/applications/recent/route.ts
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("limit") || 3)),
    );

    // Получаем последние заявки (всех статусов, но только с публичной информацией)
    const applications = await prisma.application.findMany({
      where: {
        // Показываем только заявки, которые не содержат личную информацию
        // или показываем все, но скрываем чувствительные данные
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        amount: true,
        payment: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            avatarFrame: true,
            // Не показываем email для безопасности
          },
        },
      },
    });

    // Форматируем данные для отображения
    const formattedApplications = applications.map((app) => ({
      id: app.id,
      title: app.title,
      summary: app.summary,
      amount: app.amount,
      payment: app.payment,
      status: app.status,
      createdAt: app.createdAt,
      userName: app.user.name || "Анонимный пользователь",
      userId: app.user.id,
      userAvatar: app.user.avatar,
      userAvatarFrame: app.user.avatarFrame,
      // Создаем инициал из имени или используем первую букву названия
      initial: app.user.name
        ? app.user.name.charAt(0).toUpperCase()
        : app.title.charAt(0).toUpperCase(),
    }));

    return Response.json({
      success: true,
      applications: formattedApplications,
    });
  } catch (error) {
    console.error("Ошибка при получении последних заявок:", error);
    return Response.json(
      {
        success: false,
        error: "Не удалось загрузить заявки",
        applications: [],
      },
      { status: 500 },
    );
  }
}
