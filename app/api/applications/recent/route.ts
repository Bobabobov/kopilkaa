// app/api/applications/recent/route.ts
import { prisma } from "@/lib/db";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";

// Динамический роут: Prisma + searchParams (с `force-dynamic` несовместим `revalidate` сегмента)
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      10,
      Math.max(1, Number(searchParams.get("limit") || 3)),
    );

    // Получаем последние одобренные заявки
    const applications = await prisma.application
      .findMany({
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
              avatar: true,
              ...USER_PUBLIC_BADGE_SELECT,
            },
          },
        },
      })
      .catch(() => []);

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Ошибка при получении последних заявок:", error);
    // Возвращаем пустой массив вместо ошибки
    return Response.json({
      success: true,
      applications: [],
    });
  }
}
