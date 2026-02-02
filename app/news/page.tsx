// app/news/page.tsx
import NewsPageClient from "./_components/NewsPageClient";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { NewsItem } from "@/components/news/types";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 30;

export default async function NewsPage() {
  const session = await getSession();
  const limit = DEFAULT_LIMIT;

  const posts = await prisma.projectNewsPost
    .findMany({
      where: { isPublished: true },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: Math.min(MAX_LIMIT, Math.max(1, limit)) + 1,
      include: {
        author: {
          select: { id: true, name: true, avatar: true, role: true },
        },
        media: {
          orderBy: { sort: "asc" },
          select: { id: true, url: true, type: true, sort: true },
        },
      },
    })
    .catch(() => []);

  const hasMore = posts.length > limit;
  const page = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? (page[page.length - 1]?.id ?? null) : null;

  // Реакция текущего пользователя на каждый пост (если авторизован)
  let myReactionByPostId: Record<string, "LIKE" | "DISLIKE"> = {};
  if (session?.uid && page.length) {
    const reactions = await prisma.projectNewsReaction
      .findMany({
        where: {
          userId: session.uid,
          postId: { in: page.map((p) => p.id) },
        },
        select: { postId: true, type: true },
      })
      .catch(() => []);

    myReactionByPostId = reactions.reduce(
      (acc: any, r: any) => {
        acc[r.postId] = r.type;
        return acc;
      },
      {} as Record<string, "LIKE" | "DISLIKE">,
    );
  }

  const initialItems: NewsItem[] = page.map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    createdAt: new Date(p.createdAt).toISOString(),
    updatedAt: new Date(p.updatedAt).toISOString(),
    likesCount: p.likesCount,
    dislikesCount: p.dislikesCount,
    author: p.author,
    media: p.media,
    myReaction: myReactionByPostId[p.id] ?? null,
  }));

  return (
    <NewsPageClient
      initialItems={initialItems}
      initialNextCursor={nextCursor}
      initialLastUpdatedAt={new Date().toISOString()}
    />
  );
}
