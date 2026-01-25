// app/api/admin/news/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";

export const dynamic = "force-dynamic";

type MediaInput = { url: string; type: "IMAGE" | "VIDEO"; sort?: number };

function isSafeUploadUrl(url: string): boolean {
  // Разрешаем только файлы, выданные нашим upload-роутом
  return typeof url === "string" && url.startsWith("/api/uploads/");
}

export async function GET() {
  const admin = await getAllowedAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const items = await prisma.projectNewsPost.findMany({
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 50,
    include: {
      media: { orderBy: { sort: "asc" } },
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const admin = await getAllowedAdminUser();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string | null;
      badge?: "UPDATE" | "PLANS" | "THOUGHTS" | "IMPORTANT" | null;
      content?: string;
      media?: MediaInput[];
    };

    const titleRaw = typeof body.title === "string" ? body.title.trim() : "";
    const contentRaw =
      typeof body.content === "string" ? body.content.trim() : "";
    const media = Array.isArray(body.media) ? body.media : [];

    if (!contentRaw) {
      return NextResponse.json(
        { error: "Текст новости обязателен" },
        { status: 400 },
      );
    }
    if (contentRaw.length > 5000) {
      return NextResponse.json(
        { error: "Слишком длинный текст (макс. 5000)" },
        { status: 400 },
      );
    }
    if (titleRaw.length > 120) {
      return NextResponse.json(
        { error: "Слишком длинный заголовок (макс. 120)" },
        { status: 400 },
      );
    }
    if (media.length > 10) {
      return NextResponse.json(
        { error: "Слишком много медиа (макс. 10)" },
        { status: 400 },
      );
    }

    const normalizedMedia = media
      .map((m, idx) => ({
        url: m?.url,
        type: m?.type,
        sort: Number.isFinite(m?.sort as any) ? Number(m.sort) : idx,
      }))
      .filter((m) => m.url && (m.type === "IMAGE" || m.type === "VIDEO"));

    for (const m of normalizedMedia) {
      if (!isSafeUploadUrl(m.url)) {
        return NextResponse.json(
          { error: "Разрешены только файлы, загруженные на сайт" },
          { status: 400 },
        );
      }
    }

    const badgeValue =
      body.badge &&
      ["UPDATE", "PLANS", "THOUGHTS", "IMPORTANT"].includes(body.badge)
        ? body.badge
        : null;

    const created = await prisma.projectNewsPost.create({
      data: {
        authorId: admin.id,
        title: titleRaw || null,
        badge: badgeValue,
        content: contentRaw,
        isPublished: true,
        media: normalizedMedia.length
          ? {
              create: normalizedMedia.map((m) => ({
                url: m.url,
                type: m.type as any,
                sort: m.sort,
              })),
            }
          : undefined,
      },
      include: { media: { orderBy: { sort: "asc" } } },
    });

    return NextResponse.json({ ok: true, item: created });
  } catch (error) {
    console.error("POST /api/admin/news error:", error);
    return NextResponse.json(
      { error: "Ошибка создания новости" },
      { status: 500 },
    );
  }
}
