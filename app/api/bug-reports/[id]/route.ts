// app/api/bug-reports/[id]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET - получить один баг-репорт по ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
        { status: 404 }
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
      { status: 500 }
    );
  }
}

















