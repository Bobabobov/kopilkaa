import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ads = await prisma.advertisement.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ads });
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
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
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
          content,
          imageUrl,
          linkUrl,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive: finalIsActive,
          placement: finalPlacement,
          config: config || null,
        },
      });
    });

    return NextResponse.json({ ad });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json(
      { error: "Failed to create ad" },
      { status: 500 }
    );
  }
}
