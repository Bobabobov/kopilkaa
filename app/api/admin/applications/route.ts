// app/api/admin/applications/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 10)));
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
      { title:      { contains: q } },
      { summary:    { contains: q } },
      { story:      { contains: q } },
      { payment:    { contains: q } },
      { user:       { email: { contains: q } } },
      // Поиск по сумме (если введено число)
      ...(isNaN(Number(q)) ? [] : [{ amount: Number(q) }]),
    ];
  }

  // Определяем поле и порядок сортировки
  let orderBy: any = {};
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
        user: { select: { email: true, id: true, name: true, avatar: true, avatarFrame: true, hideEmail: true } },
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
