import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

// POST /api/admin/achievements/revoke - отозвать достижение у пользователя
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { achievementId, userId } = await request.json();

    if (!achievementId || !userId) {
      return NextResponse.json({ error: "Не указаны ID достижения или пользователя" }, { status: 400 });
    }

    // Проверяем наличие userAchievement
    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
      include: { achievement: true, user: true },
    });

    if (!userAchievement) {
      return NextResponse.json({ error: "У пользователя нет этого достижения" }, { status: 404 });
    }

    await prisma.userAchievement.delete({
      where: { userId_achievementId: { userId, achievementId } },
    });

    return NextResponse.json({
      success: true,
      data: { achievementId, userId },
      message: `Достижение "${userAchievement.achievement?.name}" отозвано у ${userAchievement.user?.email || userAchievement.userId}`,
    });
  } catch (error) {
    console.error("Error revoking achievement:", error);
    return NextResponse.json(
      { error: "Ошибка отзыва достижения" },
      { status: 500 }
    );
  }
}


