import { NextRequest, NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ userId: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { userId } = await ctx.params;
    const body = await req.json().catch(() => ({}));

    if (typeof body?.withdrawalBlocked !== "boolean") {
      return NextResponse.json(
        { error: "Укажите withdrawalBlocked: true или false" },
        { status: 400 },
      );
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { bonusWithdrawalBlocked: body.withdrawalBlocked },
      select: {
        id: true,
        bonusWithdrawalBlocked: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        withdrawalBlocked: user.bonusWithdrawalBlocked,
      },
    });
  } catch (error) {
    console.error(
      "[API Error] PATCH /api/admin/bonuses/users/[userId]",
      error,
    );
    return NextResponse.json(
      { error: "Не удалось обновить блокировку вывода" },
      { status: 500 },
    );
  }
}
