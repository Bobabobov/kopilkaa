// app/api/stories/[id]/like/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function isValidStoryId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const storyId = params.id;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 },
      );
    }

    // Проверяем, что история существует
    const story = await prisma.application.findFirst({
      where: { id: storyId, status: "APPROVED" },
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json(
        { message: "История не найдена" },
        { status: 404 },
      );
    }

    // Проверяем, не лайкнул ли уже пользователь
    const existingLike = await prisma.storyLike.findFirst({
      where: {
        applicationId: storyId,
        userId: userId,
      },
    });

    if (existingLike) {
      return NextResponse.json({ message: "Уже лайкнуто" }, { status: 400 });
    }

    // Создаем лайк
    await prisma.storyLike.create({
      data: {
        applicationId: storyId,
        userId: userId,
      },
    });

    return NextResponse.json(
      { message: "Лайк добавлен" },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error adding like:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const storyId = params.id;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 },
      );
    }

    // Удаляем лайк
    const deletedLike = await prisma.storyLike.deleteMany({
      where: {
        applicationId: storyId,
        userId: userId,
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ message: "Лайк не найден" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Лайк удален" },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
