// app/api/stories/[id]/like/route.ts
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { publicStoryWhereById } from "@/lib/stories/publicStoryWhere";
import { logRouteCatchError } from "@/lib/api/parseApiError";

function isValidStoryId(id: string) {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Проверяем, что история существует и публично доступна (как в GET /api/stories/:id)
    const story = await prisma.application.findFirst({
      where: publicStoryWhereById(storyId),
      select: { id: true },
    });

    if (!story) {
      return NextResponse.json(
        { error: "История не найдена" },
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
      return NextResponse.json({ error: "Уже лайкнуто" }, { status: 400 });
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
    logRouteCatchError("POST /api/stories/[id]/like:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAuthUser(request);
  if (!session) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  try {
    const { id: storyId } = await params;
    const userId = session.uid;

    if (!isValidStoryId(storyId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Удаляем лайк
    const deletedLike = await prisma.storyLike.deleteMany({
      where: {
        applicationId: storyId,
        userId: userId,
      },
    });

    if (deletedLike.count === 0) {
      return NextResponse.json({ error: "Лайк не найден" }, { status: 404 });
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
    logRouteCatchError("DELETE /api/stories/[id]/like:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
