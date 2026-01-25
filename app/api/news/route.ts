// app/api/news/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 30;

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, Number(searchParams.get("limit") || DEFAULT_LIMIT)),
    );
    const cursor = searchParams.get("cursor");

    const posts = await prisma.projectNewsPost.findMany({
      where: { isPublished: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        media: {
          orderBy: { sort: "asc" },
          select: { id: true, url: true, type: true, sort: true },
        },
      },
    });

    const hasMore = posts.length > limit;
    const page = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

    // Реакция текущего пользователя на каждый пост (если авторизован)
    let myReactionByPostId: Record<string, "LIKE" | "DISLIKE"> = {};
    if (session?.uid && page.length) {
      const reactions = await prisma.projectNewsReaction.findMany({
        where: {
          userId: session.uid,
          postId: { in: page.map((p) => p.id) },
        },
        select: { postId: true, type: true },
      });
      myReactionByPostId = reactions.reduce(
        (acc, r) => {
          acc[r.postId] = r.type;
          return acc;
        },
        {} as Record<string, "LIKE" | "DISLIKE">,
      );
    }

    const res = NextResponse.json({
      items: page.map((p) => ({
        id: p.id,
        title: p.title,
        badge: p.badge,
        content: p.content,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        likesCount: p.likesCount,
        dislikesCount: p.dislikesCount,
        author: p.author,
        media: p.media,
        myReaction: myReactionByPostId[p.id] ?? null,
      })),
      nextCursor,
    });

    // Кэширование:
    // - для авторизованных response персонализирован (myReaction), поэтому private/no-store
    // - для неавторизованных можно кэшировать коротко, чтобы разгрузить БД
    res.headers.set("Vary", "Cookie");
    if (session?.uid) {
      res.headers.set("Cache-Control", "private, no-store, must-revalidate");
      res.headers.set("Pragma", "no-cache");
      res.headers.set("Expires", "0");
    } else {
      res.headers.set(
        "Cache-Control",
        "public, s-maxage=30, stale-while-revalidate=60",
      );
    }

    return res;
  } catch (error) {
    console.error("GET /api/news error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки новостей" },
      { status: 500 },
    );
  }
}
