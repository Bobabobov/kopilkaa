import { NextRequest, NextResponse } from "next/server";
import { GoodDeedWithdrawalStatus } from "@prisma/client";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { id } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const action = body?.action === "approve" ? "approve" : body?.action === "reject" ? "reject" : null;
    const adminComment =
      typeof body?.adminComment === "string" ? body.adminComment.trim() : "";

    if (!action || !id) {
      return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
    }

    const existing = await prisma.goodDeedWithdrawalRequest.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }

    if (existing.status !== GoodDeedWithdrawalStatus.PENDING) {
      return NextResponse.json(
        { error: "Заявка уже обработана" },
        { status: 409 },
      );
    }

    const nextStatus =
      action === "approve"
        ? GoodDeedWithdrawalStatus.APPROVED
        : GoodDeedWithdrawalStatus.REJECTED;

    await prisma.goodDeedWithdrawalRequest.update({
      where: { id },
      data: {
        status: nextStatus,
        adminComment: adminComment || null,
        reviewedAt: new Date(),
        reviewedById: admin.id,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/admin/good-deeds/withdrawals/[id] error:", error);
    return NextResponse.json(
      { error: "Не удалось обновить заявку" },
      { status: 500 },
    );
  }
}
