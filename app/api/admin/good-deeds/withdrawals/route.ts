import { NextResponse } from "next/server";
import {
  GoodDeedSubmissionStatus,
  GoodDeedWithdrawalStatus,
} from "@prisma/client";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const [rows, earnedByUser, withdrawalsByUser] = await Promise.all([
      prisma.goodDeedWithdrawalRequest.findMany({
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
      }),
      prisma.goodDeedSubmission.groupBy({
        by: ["userId"],
        where: { status: GoodDeedSubmissionStatus.APPROVED },
        _sum: { reward: true },
      }),
      prisma.goodDeedWithdrawalRequest.groupBy({
        by: ["userId", "status"],
        _sum: { amountBonuses: true },
      }),
    ]);

    const userIds = new Set<string>();
    for (const row of earnedByUser) userIds.add(row.userId);
    for (const row of withdrawalsByUser) userIds.add(row.userId);
    for (const row of rows) userIds.add(row.user.id);

    const users = userIds.size
      ? await prisma.user.findMany({
          where: { id: { in: Array.from(userIds) } },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        })
      : [];
    const userMap = new Map(users.map((u) => [u.id, u]));

    const earnedMap = new Map(
      earnedByUser.map((row) => [row.userId, row._sum.reward ?? 0]),
    );
    const withdrawalsMap = new Map<
      string,
      { withdrawnBonuses: number; pendingWithdrawalBonuses: number }
    >();

    for (const row of withdrawalsByUser) {
      const current = withdrawalsMap.get(row.userId) ?? {
        withdrawnBonuses: 0,
        pendingWithdrawalBonuses: 0,
      };
      const amount = row._sum.amountBonuses ?? 0;
      if (row.status === GoodDeedWithdrawalStatus.APPROVED) {
        current.withdrawnBonuses += amount;
      } else if (row.status === GoodDeedWithdrawalStatus.PENDING) {
        current.pendingWithdrawalBonuses += amount;
      }
      withdrawalsMap.set(row.userId, current);
    }

    const leaderboard = Array.from(userIds)
      .map((userId) => {
        const user = userMap.get(userId);
        const totalEarnedBonuses = earnedMap.get(userId) ?? 0;
        const w = withdrawalsMap.get(userId) ?? {
          withdrawnBonuses: 0,
          pendingWithdrawalBonuses: 0,
        };
        const availableBonuses = Math.max(
          0,
          totalEarnedBonuses - w.withdrawnBonuses - w.pendingWithdrawalBonuses,
        );
        return {
          user: {
            id: userId,
            name: user?.name || user?.username || "Пользователь",
            username: user?.username ?? null,
            email: user?.email ?? null,
          },
          totalEarnedBonuses,
          pendingWithdrawalBonuses: w.pendingWithdrawalBonuses,
          withdrawnBonuses: w.withdrawnBonuses,
          availableBonuses,
        };
      })
      .filter((row) => row.totalEarnedBonuses > 0 || row.availableBonuses > 0)
      .sort((a, b) => b.availableBonuses - a.availableBonuses);

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
      leaderboard,
    });
  } catch (error) {
    console.error("GET /api/admin/good-deeds/withdrawals error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить заявки" },
      { status: 500 },
    );
  }
}
