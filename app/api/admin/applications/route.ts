// app/api/admin/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const s = getSession();
  if (!s || s.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "ALL").toUpperCase(); // ALL | PENDING | APPROVED | REJECTED

  const where: any = {};
  if (status !== "ALL") where.status = status;
  if (q) {
    where.OR = [
      { title:      { contains: q } },
      { summary:    { contains: q } },
      { story:      { contains: q } },
      { payment:    { contains: q } },
      { user:       { email: { contains: q } } },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: { select: { email: true, id: true } },
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  return Response.json({
    page, limit, total, pages: Math.ceil(total / limit),
    items,
  });
}
