// app/api/users/search/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "20")),
  );

  try {
    const whereClause: any = {
      id: { not: session.uid }, // Исключаем текущего пользователя
    };

    // Если есть поисковый запрос, добавляем фильтр
    if (query.trim()) {
      // Создаем варианты поиска с разным регистром
      const lowerQuery = query.toLowerCase();
      const upperQuery = query.toUpperCase();
      const capitalizedQuery =
        query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();

      whereClause.OR = [
        { name: { contains: query } },
        { name: { contains: lowerQuery } },
        { name: { contains: upperQuery } },
        { name: { contains: capitalizedQuery } },
        { email: { contains: query } },
        { email: { contains: lowerQuery } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        hideEmail: true,
        createdAt: true,
        lastSeen: true,
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    // Получаем информацию о заявках в друзья для каждого пользователя
    const usersWithFriendshipStatus = await Promise.all(
      users.map(async (user) => {
        const friendship = await prisma.friendship.findFirst({
          where: {
            OR: [
              { requesterId: session.uid, receiverId: user.id },
              { requesterId: user.id, receiverId: session.uid },
            ],
          },
          select: {
            id: true,
            status: true,
            requesterId: true,
          },
        });

        return {
          ...user,
          friendshipStatus: friendship?.status,
          friendshipId: friendship?.id,
          isRequester: friendship?.requesterId === session.uid,
        };
      }),
    );

    return NextResponse.json({ users: usersWithFriendshipStatus });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      {
        message: "Ошибка поиска пользователей",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
