// app/api/profile/avatar-frame/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.uid) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { avatarFrame } = await request.json();

    if (!avatarFrame) {
      return NextResponse.json(
        { error: "Рамка аватарки не указана" },
        { status: 400 },
      );
    }

    // Обновляем рамку аватарки пользователя
    const updatedUser = await prisma.user.update({
      where: { id: session.uid },
      data: { avatarFrame },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        avatarFrame: true,
        headerTheme: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Рамка аватарки обновлена",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating avatar frame:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении рамки аватарки" },
      { status: 500 },
    );
  }
}
