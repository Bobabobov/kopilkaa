// app/api/stories/route.ts
import { prisma } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
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
        { user: { email: { contains: q } } },
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

    const responseData = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
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
      },
    });
  }
}
