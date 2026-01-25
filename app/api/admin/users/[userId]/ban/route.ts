// app/api/admin/users/[userId]/ban/route.ts
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function clampInt(n: unknown, min: number, max: number): number | null {
  const v = typeof n === "number" ? n : typeof n === "string" ? Number(n) : NaN;
  if (!Number.isFinite(v)) return null;
  const i = Math.floor(v);
  return Math.max(min, Math.min(max, i));
}

export async function POST(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { userId } = params;
    const { reason, days } = await request.json();
    const daysClamped = clampInt(days, 1, 365); // максимум 365 дней
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    if (user.role === "ADMIN") {
      return NextResponse.json(
        { message: "Нельзя заблокировать администратора" },
        { status: 400 },
      );
    }

    const bannedUntil = daysClamped
      ? new Date(Date.now() + daysClamped * 24 * 60 * 60 * 1000)
      : null;

    // Обновляем пользователя
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: true,
        bannedUntil,
        bannedReason: reason || "Нарушение правил",
      },
      select: {
        id: true,
        isBanned: true,
        bannedUntil: true,
        bannedReason: true,
      },
    });

    // Обновляем статус всех жалоб на этого пользователя на "resolved" (решена)
    // Обновляем только жалобы со статусом pending или reviewed
    const updatedReports = await prisma.userReport.updateMany({
      where: {
        reportedId: userId,
        status: {
          in: ["pending", "reviewed"],
        },
      },
      data: {
        status: "resolved",
        processedBy: admin.id,
        adminComment: `Пользователь заблокирован. ${reason || "Нарушение правил"}`,
      },
    });

    return NextResponse.json({
      message: daysClamped
        ? `Пользователь заблокирован на ${daysClamped} дней`
        : "Пользователь заблокирован навсегда",
      user: {
        id: updated.id,
        isBanned: updated.isBanned,
        bannedUntil: updated.bannedUntil?.toISOString() || null,
        bannedReason: updated.bannedReason,
      },
      updatedReports: updatedReports.count,
    });
  } catch (error) {
    console.error("Ban user error:", error);
    return NextResponse.json(
      { message: "Ошибка блокировки пользователя" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    return NextResponse.json({ message: "Доступ запрещён" }, { status: 403 });
  }

  try {
    const { userId } = params;
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { message: "Некорректный ID пользователя" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isBanned: true,
        bannedUntil: true,
        bannedReason: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 },
      );
    }

    // Проверяем, действительно ли пользователь заблокирован
    if (!user.isBanned) {
      return NextResponse.json({
        message: "Пользователь не был заблокирован",
        user: {
          id: user.id,
          isBanned: false,
          bannedUntil: null,
          bannedReason: null,
        },
      });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        isBanned: false,
        bannedUntil: null,
        bannedReason: null,
      },
      select: {
        id: true,
        isBanned: true,
        bannedUntil: true,
        bannedReason: true,
      },
    });

    // Удаляем все жалобы на этого пользователя при разблокировке
    const deletedReports = await prisma.userReport.deleteMany({
      where: {
        reportedId: userId,
      },
    });

    return NextResponse.json({
      message: "Блокировка снята",
      user: updated,
      deletedReports: deletedReports.count,
    });
  } catch (error) {
    console.error("Unban user error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { message: "Ошибка снятия блокировки", error: errorMessage },
      { status: 500 },
    );
  }
}
