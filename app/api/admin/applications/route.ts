// app/api/admin/applications/route.ts
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const admin = await getAllowedAdminUser();
  if (!admin)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") || 10)),
  );
  const q = (searchParams.get("q") || "").trim();
  const status = (searchParams.get("status") || "ALL").toUpperCase(); // ALL | PENDING | APPROVED | REJECTED
  const minAmount = searchParams.get("minAmount");
  const maxAmount = searchParams.get("maxAmount");
  const sortBy = searchParams.get("sortBy") || "date";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const where: any = {};
  if (status !== "ALL") where.status = status;

  // Фильтрация по сумме
  if (minAmount && !isNaN(Number(minAmount))) {
    where.amount = { ...where.amount, gte: Number(minAmount) };
  }
  if (maxAmount && !isNaN(Number(maxAmount))) {
    where.amount = { ...where.amount, lte: Number(maxAmount) };
  }

  if (q) {
    // Для SQLite используем поиск без учета регистра
    where.OR = [
      { title: { contains: q } },
      { summary: { contains: q } },
      { story: { contains: q } },
      { payment: { contains: q } },
      { user: { email: { contains: q } } },
      // Поиск по сумме (если введено число)
      ...(isNaN(Number(q)) ? [] : [{ amount: Number(q) }]),
    ];
  }

  // Определяем поле и порядок сортировки
  const orderBy: any = {};
  if (sortBy === "date") {
    orderBy.createdAt = sortOrder;
  } else if (sortBy === "amount") {
    orderBy.amount = sortOrder;
  } else if (sortBy === "status") {
    orderBy.status = sortOrder;
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            email: true,
            id: true,
            name: true,
            avatar: true,
            avatarFrame: true,
            hideEmail: true,
          },
        },
        images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
      },
    }),
    prisma.application.count({ where }),
  ]);

  const safeItems = items.map((it: any) => ({
    ...it,
    story: sanitizeApplicationStoryHtml(it.story),
  }));

  return Response.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items: safeItems,
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}
