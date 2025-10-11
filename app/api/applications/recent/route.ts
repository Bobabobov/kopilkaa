// app/api/applications/recent/route.ts
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("limit") || 3)),
    );

    // Получаем последние одобренные заявки
    const applications = await prisma.application.findMany({
      where: {
        status: "APPROVED", // Показываем только одобренные заявки
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        summary: true,
        amount: true,
        status: true,
        createdAt: true,
        images: {
          select: {
            url: true,
            sort: true,
          },
          orderBy: {
            sort: "asc",
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    return Response.json({
      success: true,
      applications: applications,
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
