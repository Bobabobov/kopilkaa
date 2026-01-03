// app/api/users/[userId]/stats/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { resolveUserIdFromIdentifier } from "@/lib/userResolve";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId: identifier } = await params;
    const userId = await resolveUserIdFromIdentifier(identifier);
    if (!userId) {
      return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
    }

    // Получаем статистику пользователя
    const [applicationsCount, userData] = await Promise.all([
      prisma.application.count({
        where: { userId: userId },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { createdAt: true },
      }),
    ]);

    const daysSinceRegistration = userData
      ? Math.floor(
          (Date.now() - new Date(userData.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    const stats = {
      applicationsCount,
      daysSinceRegistration,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Get user stats error:", error);
    return NextResponse.json(
      { message: "Ошибка получения статистики" },
      { status: 500 },
    );
  }
}
