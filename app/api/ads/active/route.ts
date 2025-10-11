import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Получаем активную рекламу, которая не истекла
    const activeAd = await prisma.advertisement.findFirst({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    if (!activeAd) {
      return NextResponse.json({ ad: null });
    }

    return NextResponse.json({ ad: activeAd });
  } catch (error) {
    console.error("Error fetching active ad:", error);
    return NextResponse.json(
      { error: "Failed to fetch active ad" },
      { status: 500 }
    );
  }
}
