import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

// Явно указываем, что роут динамический (не кэшируется)
export const dynamic = 'force-dynamic';

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

    if (!ad) {
      console.log("No active stories ad found");
      return NextResponse.json({ ad: null });
    }

    // Санитизируем HTML-поля, которые будут рендериться через dangerouslySetInnerHTML
    const safeConfig = (ad.config && typeof ad.config === "object" ? ad.config : {}) as any;
    if (typeof safeConfig.storyText === "string") {
      safeConfig.storyText = sanitizeApplicationStoryHtml(safeConfig.storyText);
    }
    const safeAd: any = {
      ...ad,
      config: safeConfig,
      content: typeof ad.content === "string" ? sanitizeApplicationStoryHtml(ad.content) : ad.content,
    };

    console.log("Found active stories ad:", { id: ad.id, placement: ad.placement, isActive: ad.isActive });
    return NextResponse.json({ ad: safeAd });
  } catch (error) {
    console.error("Error fetching stories advertisement:", error);
    // Возвращаем null, чтобы на фронте можно было показать дефолтную историю
    return NextResponse.json({ ad: null });
  }
}


