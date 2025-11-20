// app/api/top-donors/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Берём только реальные донаты из таблицы Donation (type = SUPPORT)
    const usersWithDonations = await prisma.user
      .findMany({
        where: {
          donations: {
            some: {
              type: "SUPPORT",
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          vkLink: true,
          telegramLink: true,
          youtubeLink: true,
          donations: {
            where: { type: "SUPPORT" },
            select: { amount: true },
          },
        },
      })
      .catch(() => []);

    // Считаем сумму донатов по каждому пользователю
    const donors = usersWithDonations
      .map((user) => {
        const totalAmount = user.donations.reduce(
          (sum, d) => sum + d.amount,
          0,
        );
        return {
          id: user.id,
          name: user.name || user.email.split("@")[0],
          email: user.email,
          avatar: user.avatar,
          vkLink: user.vkLink,
          telegramLink: user.telegramLink,
          youtubeLink: user.youtubeLink,
          totalAmount,
        };
      })
      .filter((donor) => donor.totalAmount > 0)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      donors: donors.map((donor, index) => ({
        ...donor,
        position: index + 1,
        isTop: index === 0,
        amount: donor.totalAmount.toLocaleString("ru-RU"),
      })),
    });
  } catch (error) {
    console.error("Error fetching top donors:", error);
    return NextResponse.json({
      success: true,
      donors: [],
    });
  }
}



