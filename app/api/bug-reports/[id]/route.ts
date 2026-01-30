// app/api/bug-reports/[id]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - получить один баг-репорт по ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const report = await prisma.bugReport.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        images: {
          orderBy: { sort: "asc" },
        },
        likes: {
          select: {
            userId: true,
            isLike: true,
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { message: "Баг-репорт не найден" },
        { status: 404 },
      );
    }

    // Подсчитываем лайки и дизлайки
    const likes = report.likes.filter((l) => l.isLike).length;
    const dislikes = report.likes.filter((l) => !l.isLike).length;

    // Проверяем, лайкнул ли текущий пользователь
    const session = await getSession();
    let userLike: boolean | null = null;
    if (session) {
      const userLikeData = report.likes.find((l) => l.userId === session.uid);
      if (userLikeData) {
        userLike = userLikeData.isLike;
      }
    }

    return NextResponse.json({
      report: {
        ...report,
        likesCount: likes,
        dislikesCount: dislikes,
        userLike,
        likes: undefined, // Убираем массив likes из ответа
      },
    });
  } catch (error: any) {
    console.error("Get bug report error:", error);
    return NextResponse.json(
      {
        message: "Ошибка загрузки баг-репорта",
        error: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}

// DELETE - удалить баг-репорт (только автор)
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.bugReport.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Баг-репорт не найден" },
        { status: 404 },
      );
    }

    if (existing.userId !== session.uid) {
      return NextResponse.json(
        { error: "Недостаточно прав для удаления" },
        { status: 403 },
      );
    }

    await prisma.bugReport.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete bug report error:", error);
    return NextResponse.json(
      { error: "Ошибка удаления баг-репорта" },
      { status: 500 },
    );
  }
}
