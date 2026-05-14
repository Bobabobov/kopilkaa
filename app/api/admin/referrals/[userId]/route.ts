import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { userId } = await params;
    if (!userId?.trim()) {
      return NextResponse.json({ error: "Некорректный id" }, { status: 400 });
    }

    const referrer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        referralCode: true,
        createdAt: true,
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const registrations = await prisma.referralRegistration.findMany({
      where: { referrerUserId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        referredUserId: true,
        createdAt: true,
        bonusGrantedAt: true,
        referredUser: {
          select: {
            id: true,
            email: true,
            name: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });

    const referred = registrations.map((r) => {
      const u = r.referredUser;
      const displayName =
        u.name?.trim() ||
        (u.username ? `@${u.username}` : null) ||
        u.email?.split("@")[0] ||
        "—";
      return {
        userId: r.referredUserId,
        displayName,
        email: u.email,
        username: u.username,
        registeredAt: r.createdAt.toISOString(),
        accountCreatedAt: u.createdAt.toISOString(),
        bonusGrantedAt: r.bonusGrantedAt?.toISOString() ?? null,
      };
    });

    const referrerDisplayName =
      referrer.name?.trim() ||
      (referrer.username ? `@${referrer.username}` : null) ||
      referrer.email?.split("@")[0] ||
      "—";

    return NextResponse.json({
      success: true,
      referrer: {
        userId: referrer.id,
        displayName: referrerDisplayName,
        email: referrer.email,
        username: referrer.username,
        referralCode: referrer.referralCode,
        createdAt: referrer.createdAt.toISOString(),
      },
      referred,
      total: referred.length,
    });
  } catch (error) {
    console.error("[API Error] GET /api/admin/referrals/[userId]:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить рефералов пользователя" },
      { status: 500 },
    );
  }
}
