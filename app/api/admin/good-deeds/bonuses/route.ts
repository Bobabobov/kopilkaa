import { NextRequest, NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const userId = String(body?.userId ?? "").trim();
    const amountRaw = body?.amountBonuses;
    const amountBonuses =
      typeof amountRaw === "number"
        ? Math.floor(amountRaw)
        : parseInt(String(amountRaw ?? ""), 10);
    const comment =
      typeof body?.comment === "string"
        ? body.comment.trim().slice(0, 300)
        : "";

    if (!userId || !Number.isFinite(amountBonuses) || amountBonuses <= 0) {
      return NextResponse.json(
        { error: "Некорректные данные" },
        { status: 400 },
      );
    }

    if (amountBonuses > 10000) {
      return NextResponse.json(
        { error: "Слишком большое начисление за раз" },
        { status: 400 },
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!userExists) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    await prisma.goodDeedBonusGrant.create({
      data: {
        userId,
        amountBonuses,
        comment: comment || null,
        grantedById: admin.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/admin/good-deeds/bonuses error:", error);
    return NextResponse.json(
      { error: "Не удалось начислить бонусы" },
      { status: 500 },
    );
  }
}
