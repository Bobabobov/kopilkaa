// app/api/applications/mine/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: "Требуется вход" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 10)),
    );
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.application.findMany({
        where: { userId: session.uid },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          summary: true,
          story: true,
          amount: true,
          payment: true,
          status: true,
          adminComment: true,
          createdAt: true,
          images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
        },
      }),
      prisma.application.count({ where: { userId: session.uid } }),
    ]);

    const safeItems = items.map((it: { story: string; [key: string]: unknown }) => ({
      ...it,
      story: sanitizeApplicationStoryHtml(it.story),
    }));

    return Response.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items: safeItems,
    });
  } catch (error) {
    console.error("Error fetching my applications:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
