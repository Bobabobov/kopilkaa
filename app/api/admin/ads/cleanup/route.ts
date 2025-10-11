import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Деактивируем истекшие рекламы
    const expiredAds = await prisma.advertisement.updateMany({
      where: {
        expiresAt: {
          lt: new Date()
        },
        isActive: true
      },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ 
      success: true, 
      deactivatedCount: expiredAds.count 
    });
  } catch (error) {
    console.error("Error cleaning up expired ads:", error);
    return NextResponse.json(
      { error: "Failed to cleanup expired ads" },
      { status: 500 }
    );
  }
}
