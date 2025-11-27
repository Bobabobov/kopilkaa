import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const ad = await prisma.advertisement.update({
      where: { id: params.id },
      data: {
        title,
        content,
        imageUrl,
        linkUrl,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
        placement: placement || "home_sidebar",
        config: config || null,
      },
    });

    return NextResponse.json({ ad });
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Используем deleteMany, чтобы не падать с ошибкой, если запись уже удалена
    await prisma.advertisement.deleteMany({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ad:", error);
    return NextResponse.json(
      { error: "Failed to delete ad" },
      { status: 500 }
    );
  }
}
