import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const take = Math.min(Number(searchParams.get("take") || 5), 20);
    const cursor = searchParams.get("cursor") || undefined;
    const otherUserId = params.userId;

    const apps = await prisma.application.findMany({
      where: { userId: otherUserId },
      select: {
        id: true,
        status: true,
        title: true,
        amount: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    let nextCursor: string | null = null;
    if (apps.length > take) {
      const next = apps.pop();
      nextCursor = next ? next.id : null;
    }

    return NextResponse.json({ applications: apps, nextCursor });
  } catch (error) {
    console.error("Other user recent applications error:", error);
    return NextResponse.json(
      { message: "Ошибка получения заявок пользователя" },
      { status: 500 },
    );
  }
}


