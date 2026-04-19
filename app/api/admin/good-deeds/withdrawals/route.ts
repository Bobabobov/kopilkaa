import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const rows = await prisma.goodDeedWithdrawalRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        amountBonuses: true,
        bankName: true,
        details: true,
        status: true,
        adminComment: true,
        reviewedAt: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      items: rows.map((r) => ({
        id: r.id,
        amountBonuses: r.amountBonuses,
        bankName: r.bankName,
        details: r.details,
        status: r.status,
        adminComment: r.adminComment,
        reviewedAt: r.reviewedAt,
        createdAt: r.createdAt,
        user: {
          id: r.user.id,
          name: r.user.name || r.user.username || "Пользователь",
          username: r.user.username,
          email: r.user.email,
        },
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/good-deeds/withdrawals error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 },
    );
  }
}
