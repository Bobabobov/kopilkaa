import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.uid;

    // Получаем пожертвования пользователя
    const donations = await prisma.donation.findMany({
      where: {
        userId,
        type: "SUPPORT", // Только входящие пожертвования
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Последние 10 пожертвований
    });

    // Подсчитываем статистику
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
    const donationsCount = donations.length;

    // Получаем общую статистику (все пожертвования пользователя)
    const allDonations = await prisma.donation.findMany({
      where: {
        userId,
        type: "SUPPORT",
      },
      select: {
        amount: true,
      },
    });

    const totalAllDonated = allDonations.reduce((sum, d) => sum + d.amount, 0);
    const totalAllCount = allDonations.length;

    return NextResponse.json({
      donations: donations.map((d) => ({
        id: d.id,
        amount: d.amount,
        comment: d.comment,
        createdAt: d.createdAt,
      })),
      stats: {
        totalDonated: totalAllDonated,
        donationsCount: totalAllCount,
        recentDonated: totalDonated,
        recentCount: donationsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user donations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

