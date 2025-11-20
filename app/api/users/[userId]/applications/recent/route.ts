import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const { userId: otherUserId } = await params;

    // Получаем только первые 3 одобренные заявки
    const apps = await prisma.application.findMany({
      where: { 
        userId: otherUserId,
        status: "APPROVED" // Только одобренные заявки
      },
      select: {
        id: true,
        status: true,
        title: true,
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 3, // Максимум 3 заявки
    });

    return NextResponse.json({ applications: apps });
  } catch (error) {
    console.error("Other user recent applications error:", error);
    return NextResponse.json(
      { message: "Ошибка получения заявок пользователя" },
      { status: 500 },
    );
  }
}


