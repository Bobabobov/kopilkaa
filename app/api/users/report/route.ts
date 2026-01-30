// app/api/users/report/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { userId, reason } = await request.json();

    if (!userId || !reason || !reason.trim()) {
      return NextResponse.json(
        { error: "Необходимо указать пользователя и причину жалобы" },
        { status: 400 },
      );
    }

    if (userId === session.uid) {
      return NextResponse.json(
        { error: "Нельзя пожаловаться на себя" },
        { status: 400 },
      );
    }

    const reportedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!reportedUser) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const report = await prisma.userReport.create({
      data: {
        reporterId: session.uid,
        reportedId: userId,
        reason: reason.trim(),
      },
    });

    return NextResponse.json({
      message: "Жалоба отправлена",
      report: { id: report.id },
    });
  } catch (error) {
    console.error("Report user error:", error);
    return NextResponse.json(
      { error: "Ошибка отправки жалобы" },
      { status: 500 },
    );
  }
}
