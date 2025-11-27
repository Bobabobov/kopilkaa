import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const ad = await prisma.advertisement.findFirst({
      where: {
        isActive: true,
        placement: "stories",
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ ad });
  } catch (error) {
    console.error("Error fetching stories advertisement:", error);
    // Возвращаем null, чтобы на фронте можно было показать дефолтную историю
    return NextResponse.json({ ad: null });
  }
}


