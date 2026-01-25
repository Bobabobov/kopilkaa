import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Явно указываем, что роут динамический (не кэшируется)
export const dynamic = "force-dynamic";

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
      .catch((error) => {
        console.error("Error fetching home_sidebar ad:", error);
        return null;
      });

    // 2. Если нет отдельного размещения "home_sidebar" —
    //    берём любую другую активную рекламу, кроме большого баннера и stories
    if (!activeAd) {
      activeAd = await prisma.advertisement
        .findFirst({
          where: {
            isActive: true,
            placement: { notIn: ["home_banner", "stories"] },
            ...dateWhere,
          },
          orderBy: { createdAt: "desc" },
        })
        .catch((error) => {
          console.error("Error fetching fallback ad:", error);
          return null;
        });
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
