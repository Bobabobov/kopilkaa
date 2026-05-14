import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sanitizeAdHtml } from "@/lib/ads/sanitize";
import { logRouteCatchError } from "@/lib/api/parseApiError";

// Явно указываем, что роут динамический (не кэшируется)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const ad = await prisma.advertisement.findFirst({
      where: {
        isActive: true,
        placement: "stories",
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!ad) {
      return NextResponse.json({ ad: null });
    }

    // Санитизируем HTML-поля, которые будут рендериться через dangerouslySetInnerHTML
    const rawConfig =
      ad.config && typeof ad.config === "object" ? ad.config : {};
    const safeConfig: Record<string, unknown> = {
      ...(rawConfig as Record<string, unknown>),
    };
    if (typeof safeConfig.storyText === "string") {
      safeConfig.storyText = sanitizeAdHtml(safeConfig.storyText);
    }
    const safeAd = {
      ...ad,
      config: safeConfig,
      content:
        typeof ad.content === "string"
          ? sanitizeAdHtml(ad.content)
          : ad.content,
    };

    return NextResponse.json({ ad: safeAd });
  } catch (error) {
    logRouteCatchError("[API GET /api/ads/stories]", error);
    // Возвращаем null, чтобы на фронте можно было показать дефолтную историю
    return NextResponse.json({ ad: null });
  }
}
