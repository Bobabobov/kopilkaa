import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: "desc" },
    });

    const safeAds = ads.map((ad: any) => {
      const safeConfig =
        ad?.config && typeof ad.config === "object" ? { ...(ad.config as any) } : null;
      if (safeConfig && typeof safeConfig.storyText === "string") {
        safeConfig.storyText = sanitizeApplicationStoryHtml(safeConfig.storyText);
      }
      return {
        ...ad,
        config: safeConfig,
        content: typeof ad.content === "string" ? sanitizeApplicationStoryHtml(ad.content) : ad.content,
      };
    });

    return NextResponse.json({ ads: safeAds });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json(
      { error: "Failed to fetch ads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      content,
      imageUrl,
      linkUrl,
      expiresAt,
      isActive,
      placement,
      config,
    } = await request.json();

    const finalPlacement: string = placement || "home_sidebar";
    const finalIsActive: boolean = isActive ?? true;
    const safeContent = typeof content === "string" ? sanitizeApplicationStoryHtml(content) : content;
    const safeConfig =
      config && typeof config === "object" ? { ...(config as any) } : config;
    if (safeConfig && typeof (safeConfig as any).storyText === "string") {
      (safeConfig as any).storyText = sanitizeApplicationStoryHtml((safeConfig as any).storyText);
    }

    // Гарантируем "один активный баннер на слот" для home_banner:
    // при создании активного home_banner деактивируем предыдущие активные записи этого же placement.
    const ad = await prisma.$transaction(async (tx) => {
      if (finalPlacement === "home_banner" && finalIsActive) {
        await tx.advertisement.updateMany({
          where: { placement: "home_banner", isActive: true },
          data: { isActive: false },
        });
      }

      return tx.advertisement.create({
        data: {
          title,
          content: safeContent,
          imageUrl,
          linkUrl,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: finalIsActive,
          placement: finalPlacement,
          config: safeConfig || null,
        },
      });
    });

    return NextResponse.json({
      ad: {
        ...ad,
        config: safeConfig || null,
        content: typeof ad.content === "string" ? sanitizeApplicationStoryHtml(ad.content) : ad.content,
      },
    });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}
