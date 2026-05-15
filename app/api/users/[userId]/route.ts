// app/api/users/[userId]/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { isUsernameIdentifier } from "@/lib/userResolve";
import { USER_PUBLIC_BADGE_SELECT } from "@/lib/userPublicBadges";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  try {
    const { userId: identifier } = await params;

    const normalized = String(identifier ?? "").trim();
    if (!normalized) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const baseSelect = {
      id: true,
      username: true,
      email: true,
      name: true,
      avatar: true,
      headerTheme: true,
      avatarFrame: true,
      hideEmail: true,
      vkLink: true,
      telegramLink: true,
      youtubeLink: true,
      lastSeen: true,
      createdAt: true,
      role: true,
      isBanned: true,
      bannedUntil: true,
      bannedReason: true,
      ...USER_PUBLIC_BADGE_SELECT,
    } as const;

    const user = isUsernameIdentifier(normalized)
      ? await prisma.user.findUnique({
          where: { username: normalized.slice(1).trim().toLowerCase() },
          select: baseSelect,
        })
      : await prisma.user.findUnique({
          where: { id: normalized },
          select: baseSelect,
        });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const safeUser = sanitizeEmailForViewer(user, session.uid);

    return NextResponse.json({ user: safeUser });
  } catch (error) {
    logRouteCatchError("[API GET /api/users/[userId]]", error);
    return NextResponse.json(
      { message: "Ошибка получения пользователя" },
      { status: 500 },
    );
  }
}
