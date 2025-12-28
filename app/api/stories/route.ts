// app/api/stories/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getSession();
    const viewerId = session?.uid || null;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 12)),
    );
    const q = (searchParams.get("q") || "").trim();

    const where: any = { status: "APPROVED" };
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { story: { contains: q } },
        { user: { name: { contains: q } } },
        // Поиск по email — только если пользователь разрешил показывать email
        { user: { email: { contains: q }, hideEmail: false } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true,
          createdAt: true,
          images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
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
      }).catch(() => []),
      prisma.application.count({ where }).catch(() => 0),
    ]);

    // userLiked батчем (без N+1)
    let likedSet: Set<string> | null = null;
    if (viewerId && items.length) {
      const likes = await prisma.storyLike.findMany({
        where: {
          userId: viewerId,
          applicationId: { in: items.map((i: any) => i.id) },
        },
        select: { applicationId: true },
      }).catch(() => []);
      likedSet = new Set(likes.map((l) => l.applicationId));
    }

    const safeItems = items.map((it: any) => ({
      ...it,
      user: it.user ? sanitizeEmailForViewer(it.user, viewerId || "") : it.user,
      userLiked: likedSet ? likedSet.has(it.id) : false,
    }));

    const responseData = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items: safeItems,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error fetching stories:", error);
    return new Response(JSON.stringify({
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
      items: [],
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  }
}
