// app/api/applications/recent/route.ts
import { prisma } from "@/lib/db";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

// Явно указываем, что роут динамический (использует request.url)
export const dynamic = 'force-dynamic';

// Кэшируем на 10 секунд (реже обновляется чем статистика)
export const revalidate = 10;

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
            avatar: true,
          },
        },
      },
    }).catch(() => []);

    const userIds = applications.map((a) => a.user?.id).filter(Boolean) as string[];
    const badgeMap = await getHeroBadgesForUsers(userIds);

    return Response.json({
      success: true,
      applications: applications.map((a: any) => ({
        ...a,
        user: a.user ? { ...(a.user as any), heroBadge: badgeMap[a.user.id] ?? null } : a.user,
      })),
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
