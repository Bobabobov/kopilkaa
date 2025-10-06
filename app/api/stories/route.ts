// app/api/stories/route.ts
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
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
    }),
    prisma.application.count({ where }),
  ]);

  return Response.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items,
  });
}
