import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// DEPRECATED: используйте GET /api/ads?placement=home_banner
// Оставлено для обратной совместимости. Контракт ответа НЕ меняем: { ad: Advertisement | null }
export async function GET() {
  try {
    const now = new Date();
    const ad = await prisma.advertisement
      .findFirst({
        where: {
          isActive: true,
          placement: "home_banner",
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => null);
    return NextResponse.json({ ad: ad ?? null });
  } catch (error) {
    console.error("Error fetching banner ad (deprecated route):", error);
    return NextResponse.json({ ad: null });
  }
}




