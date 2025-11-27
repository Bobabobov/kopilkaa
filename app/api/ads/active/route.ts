import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();

    // Базовое условие по дате
    const dateWhere = {
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    };

    // 1. Пытаемся найти специальное размещение для блока сбоку
    let activeAd = await prisma.advertisement
      .findFirst({
        where: {
          isActive: true,
          placement: "home_sidebar",
          ...dateWhere,
        },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => null);

    // 2. Если нет отдельного размещения "home_sidebar" —
    //    берём любую другую активную рекламу, кроме большого баннера
    if (!activeAd) {
      activeAd = await prisma.advertisement
        .findFirst({
          where: {
            isActive: true,
            placement: { not: "home_banner" },
            ...dateWhere,
          },
          orderBy: { createdAt: "desc" },
        })
        .catch(() => null);
    }

    if (!activeAd) {
      return NextResponse.json({ ad: null });
    }

    return NextResponse.json({ ad: activeAd });
  } catch (error) {
    console.error("Error fetching active ad:", error);
    // Возвращаем null вместо ошибки
    return NextResponse.json({ ad: null });
  }
}
