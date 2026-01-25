import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Получаем все активные рекламы, которые не истекли
    const activeAds = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
    });

    if (activeAds.length === 0) {
      return NextResponse.json({ ad: null });
    }

    // Простая ротация по времени (каждые 24 часа)
    const now = new Date();
    const hoursSinceEpoch = Math.floor(now.getTime() / (1000 * 60 * 60));
    const adIndex = hoursSinceEpoch % activeAds.length;

    const selectedAd = activeAds[adIndex];

    return NextResponse.json(
      { ad: selectedAd },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error rotating ads:", error);
    return NextResponse.json(
      { error: "Failed to rotate ads" },
      { status: 500 },
    );
  }
}
