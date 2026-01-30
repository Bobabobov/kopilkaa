import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";
import { getHeroBadgesForUsers } from "@/lib/heroBadges";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const viewerId = session?.uid || null;

    const { searchParams } = new URL(req.url);
    const limit = Math.min(
      12,
      Math.max(1, Number(searchParams.get("limit") || 3)),
    );

    const items = await prisma.application
      .findMany({
        where: { status: "APPROVED" },
        orderBy: [
          { likes: { _count: "desc" } },
          { createdAt: "desc" },
        ],
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true,
          amount: true,
          createdAt: true,
          images: {
            orderBy: { sort: "asc" },
            select: { url: true, sort: true },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              avatarFrame: true,
              headerTheme: true,
              hideEmail: true,
            },
          },
          _count: { select: { likes: true } },
        },
      })
      .catch(() => []);

    // userLiked батчем (без N+1)
    let likedSet: Set<string> | null = null;
    if (viewerId && items.length) {
      const likes = await prisma.storyLike
        .findMany({
          where: {
            userId: viewerId,
            applicationId: { in: items.map((i: any) => i.id) },
          },
          select: { applicationId: true },
        })
        .catch(() => []);
      likedSet = new Set(likes.map((l) => l.applicationId));
    }

    const safeItems = items.map((it: any) => ({
      ...it,
      user: it.user ? sanitizeEmailForViewer(it.user, viewerId || "") : it.user,
      userLiked: likedSet ? likedSet.has(it.id) : false,
    }));

    const userIds = safeItems
      .map((it: any) => it.user?.id)
      .filter(Boolean) as string[];
    const badgeMap = await getHeroBadgesForUsers(userIds);

    const withBadges = safeItems.map((it: any) => ({
      ...it,
      user: it.user
        ? { ...(it.user as any), heroBadge: badgeMap[it.user.id] ?? null }
        : it.user,
    }));

    return new Response(JSON.stringify({ items: withBadges }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching top stories:", error);
    return new Response(JSON.stringify({ items: [] }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
