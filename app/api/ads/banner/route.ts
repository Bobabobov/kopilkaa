import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const activeBanner = await prisma.advertisement
      .findFirst({
        where: {
          isActive: true,
          placement: "home_banner",
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => null);

    if (!activeBanner) {
      return NextResponse.json({ ad: null });
    }

    return NextResponse.json({ ad: activeBanner });
  } catch (error) {
    console.error("Error fetching banner ad:", error);
    return NextResponse.json({ ad: null });
  }
}




