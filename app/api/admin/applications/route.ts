// app/api/admin/applications/route.ts
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { sanitizeApplicationStoryHtml } from "@/lib/applications/sanitize";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

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
      where.OR = [
        { title: { contains: q } },
        { summary: { contains: q } },
        { story: { contains: q } },
        { payment: { contains: q } },
        { user: { email: { contains: q } } },
        ...(isNaN(Number(q)) ? [] : [{ amount: Number(q) }]),
      ];
    }

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
        select: {
          id: true,
          userId: true,
          title: true,
          summary: true,
          story: true,
          amount: true,
          payment: true,
          status: true,
          adminComment: true,
          createdAt: true,
          updatedAt: true,
          filledMs: true,
          countTowardsTrust: true,
          user: {
            select: {
              email: true,
              id: true,
              name: true,
              avatar: true,
              avatarFrame: true,
              hideEmail: true,
              trustDelta: true,
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

    return Response.json(
      {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        items: safeItems,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Error fetching admin applications:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
