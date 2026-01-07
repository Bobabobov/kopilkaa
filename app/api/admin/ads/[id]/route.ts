import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Обрабатываем params как Promise или объект
    const { id } = await Promise.resolve(params);

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
    const finalIsActive: boolean = !!isActive;
    const safeContent = typeof content === "string" ? sanitizeApplicationStoryHtml(content) : content;
    const safeConfig =
      config && typeof config === "object" ? { ...(config as any) } : config;
    if (safeConfig && typeof (safeConfig as any).storyText === "string") {
      (safeConfig as any).storyText = sanitizeApplicationStoryHtml((safeConfig as any).storyText);
    }

    // Гарантируем "один активный баннер на слот" для home_banner:
    // если этот баннер становится активным home_banner — деактивируем остальные активные home_banner.
    const ad = await prisma.$transaction(async (tx) => {
      if (finalPlacement === "home_banner" && finalIsActive) {
        await tx.advertisement.updateMany({
          where: { placement: "home_banner", isActive: true, NOT: { id } },
          data: { isActive: false },
        });
      }

      return tx.advertisement.update({
        where: { id },
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
    console.error("Error updating ad:", error);
    return NextResponse.json(
      { error: "Failed to update ad" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const IS_PROD = process.env.NODE_ENV === "production";
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Обрабатываем params как Promise или объект
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams.id;

    if (!IS_PROD) console.log("Deleting ad with id:", id);

    // Проверяем существование записи перед удалением
    const existingAd = await prisma.advertisement.findUnique({
      where: { id },
    });

    if (!existingAd) {
      if (!IS_PROD) console.log("Advertisement not found:", id);
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 }
      );
    }

    // Удаляем запись
    await prisma.advertisement.delete({
      where: { id },
    });

    if (!IS_PROD) console.log("Advertisement deleted successfully:", id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting ad:", error);
    
    // Если ошибка о том, что запись не найдена
    if (error.code === "P2025" || error.message?.includes("Record to delete does not exist")) {
      return NextResponse.json(
        { error: "Advertisement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete ad", details: error.message },
      { status: 500 }
    );
  }
}
