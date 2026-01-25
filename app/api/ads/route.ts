import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type AssetType = "video" | "image";

type ResolvedAsset = {
  type: AssetType | null;
  url: string | null;
};

type ResolvedAdResponse = {
  desktop: ResolvedAsset;
  mobile: ResolvedAsset;
  title: string | null;
  content: string | null;
  linkUrl: string | null;
  imageUrl: string | null;
};

const TOP_BANNER_FALLBACK_IMAGE = "/gabriel-cardinal-goosebumps-patreon.gif";

async function findActiveAdByPlacement(placement: string) {
  const now = new Date();
  return prisma.advertisement
    .findFirst({
      where: {
        isActive: true,
        placement,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => null);
}

function pickAsset(args: {
  videoUrl?: string | null;
  imageUrl?: string | null;
}): ResolvedAsset {
  const video = (args.videoUrl || "").trim();
  if (video) return { type: "video", url: video };
  const image = (args.imageUrl || "").trim();
  if (image) return { type: "image", url: image };
  return { type: null, url: null };
}

function normalizeMobileFallback(
  mobile: ResolvedAsset,
  desktop: ResolvedAsset,
) {
  if (mobile.type && mobile.url) return mobile;
  return desktop;
}

function normalizeDesktopFallback(
  desktop: ResolvedAsset,
  mobile: ResolvedAsset,
) {
  if (desktop.type && desktop.url) return desktop;
  return mobile;
}

export async function GET(req: NextRequest) {
  try {
    const placement = req.nextUrl.searchParams.get("placement")?.trim();
    if (!placement) {
      return NextResponse.json(
        { error: "Missing query param: placement" },
        { status: 400 },
      );
    }

    const ad = await findActiveAdByPlacement(placement);

    // Требование: вернуть null, если баннера нет
    if (!ad) {
      return NextResponse.json(null);
    }

    // Серверная нормализация ассетов для TopBanner.
    // Для обратной совместимости: если каких-то полей нет — используем fallback'и.
    const config = (ad.config || {}) as {
      bannerMobileImageUrl?: string | null;
      bannerVideoUrl?: string | null;
      bannerMobileVideoUrl?: string | null;
    };

    // Desktop asset: video > image (imageUrl, с fallback картинкой)
    const desktopRaw = pickAsset({
      videoUrl: config.bannerVideoUrl ?? null,
      imageUrl: ad.imageUrl ?? TOP_BANNER_FALLBACK_IMAGE,
    });

    // Mobile asset: video > image (bannerMobileImageUrl), fallback to desktop asset
    const mobileRaw = pickAsset({
      videoUrl: config.bannerMobileVideoUrl ?? null,
      imageUrl: config.bannerMobileImageUrl ?? null,
    });

    const mobile = normalizeMobileFallback(mobileRaw, desktopRaw);
    const desktop = normalizeDesktopFallback(desktopRaw, mobile);

    const payload: ResolvedAdResponse = {
      desktop,
      mobile,
      title: ad.title || null,
      content: ad.content || ad.title || null,
      linkUrl: ad.linkUrl ?? null,
      imageUrl: ad.imageUrl ?? null,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error fetching ad by placement:", error);
    return NextResponse.json(null);
  }
}
