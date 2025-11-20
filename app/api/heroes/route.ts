// app/api/heroes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Берём реальных пользователей, у которых есть одобренные заявки
    const users = await prisma.user
      .findMany({
        where: {
          applications: {
            some: {
              status: "APPROVED",
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          createdAt: true,
          vkLink: true,
          telegramLink: true,
          youtubeLink: true,
          applications: {
            where: {
              status: "APPROVED",
            },
            select: {
              amount: true,
            },
          },
        },
      })
      .catch(() => []);

    const heroesRaw = users
      .map((user) => {
        const totalDonated = user.applications.reduce(
          (sum, app) => sum + app.amount,
          0,
        );
        const donationCount = user.applications.length;

        return {
          id: user.id,
          name: user.name || user.email.split("@")[0],
          avatar: user.avatar,
          totalDonated,
          donationCount,
          joinedAt: user.createdAt,
          isSubscriber: donationCount >= 3,
          vkLink: user.vkLink,
          telegramLink: user.telegramLink,
          youtubeLink: user.youtubeLink,
        };
      })
      .filter((hero) => hero.totalDonated > 0)
      .sort((a, b) => b.totalDonated - a.totalDonated);

    const heroes = heroesRaw.map((hero, index) => ({
      ...hero,
      rank: index + 1,
    }));

    return NextResponse.json(
      {
        heroes,
        total: heroes.length,
        message:
          heroes.length === 0
            ? "Пока нет героев проекта. Стань первым, кто поддержит историю!"
            : null,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      },
    );
  } catch (error) {
    console.error("Ошибка при получении героев:", error);
    // Возвращаем пустой список вместо падения страницы
    return NextResponse.json(
      {
        heroes: [],
        total: 0,
        message: "Пока нет героев проекта. Стань первым, кто поддержит историю!",
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      },
    );
  }
}
