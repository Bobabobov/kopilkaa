import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkUserBan } from "@/lib/ban-check";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    // Проверяем блокировку пользователя
    const banStatus = await checkUserBan(session.uid);
    if (banStatus.isBanned) {
      return NextResponse.json(
        {
          authorized: false,
          banned: true,
          banInfo: {
            reason: banStatus.bannedReason,
            until: banStatus.bannedUntil?.toISOString() || null,
            isPermanent: banStatus.isPermanent,
          },
        },
        { status: 403 },
      );
    }

    // Получаем данные пользователя из базы
    const user = await prisma.user.findUnique({
      where: { id: session.uid },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ authorized: false }, { status: 401 });
    }

    return NextResponse.json({
      authorized: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка проверки авторизации:", error);
    return NextResponse.json({ authorized: false }, { status: 500 });
  }
}
