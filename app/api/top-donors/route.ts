// app/api/top-donors/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Получаем пользователей с одобренными заявками и суммируем их суммы с обработкой ошибок
    const usersWithAmounts = await prisma.user.findMany({
      where: {
        applications: {
          some: {
            status: "APPROVED",
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
        applications: {
          where: {
            status: "APPROVED",
          },
          select: {
            amount: true,
          },
        },
      },
    }).catch(() => []);

    // Вычисляем общую сумму для каждого пользователя
    const donors = usersWithAmounts
      .map((user) => {
        const totalAmount = user.applications.reduce(
          (sum, app) => sum + app.amount,
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
      .filter((donor) => donor.totalAmount > 0) // Только с положительной суммой
      .sort((a, b) => b.totalAmount - a.totalAmount) // Сортируем по убыванию
      .slice(0, 3); // Берем топ-3

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
    // Возвращаем пустой массив вместо ошибки
    return NextResponse.json({
      success: true,
      donors: [],
    });
  }
}



