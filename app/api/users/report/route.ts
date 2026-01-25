// app/api/users/report/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId, reason } = await request.json();

    if (!userId || !reason || !reason.trim()) {
      return NextResponse.json(
        { message: "Необходимо указать пользователя и причину жалобы" },
        { status: 400 },
      );
    }

    if (userId === session.uid) {
      return NextResponse.json(
        { message: "Нельзя пожаловаться на себя" },
        { status: 400 },
      );
    }

    // Проверяем, существует ли пользователь
    const reportedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!reportedUser) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    // Создаём жалобу
    const report = await prisma.userReport.create({
      data: {
        reporterId: session.uid,
        reportedId: userId,
        reason: reason.trim(),
      },
    });

    return NextResponse.json({
      message: "Жалоба отправлена",
      report: {
        id: report.id,
      },
    });
  } catch (error) {
    console.error("Report user error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    const errorDetails =
      error instanceof Error ? error.toString() : String(error);
    return NextResponse.json(
      {
        message: "Ошибка отправки жалобы",
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 },
    );
  }
}
