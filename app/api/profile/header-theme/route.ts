// app/api/profile/header-theme/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { headerTheme } = await req.json();

    if (!headerTheme) {
      return NextResponse.json(
        { error: "Тема заголовка обязательна" },
        { status: 400 },
      );
    }

    // Валидация темы
    const validThemes = [
      "default",
      "nature",
      "ocean",
      "space",
      "city",
      "abstract",
    ];
    if (!validThemes.includes(headerTheme)) {
      return NextResponse.json(
        { error: "Недопустимая тема заголовка" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: session.uid },
      data: { headerTheme },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        headerTheme: true,
        role: true,
        createdAt: true,
        lastSeen: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
      message: "Тема заголовка обновлена",
    });
  } catch (error) {
    console.error("Error updating header theme:", error);
    return NextResponse.json(
      { error: "Ошибка обновления темы заголовка" },
      { status: 500 },
    );
  }
}
