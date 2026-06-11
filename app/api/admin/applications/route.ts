// app/api/admin/applications/route.ts
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { buildApplicationSearchWhere } from "@/lib/admin/applicationSearch";
import { buildApplicationIntegrityBatch } from "@/lib/admin/buildApplicationIntegrityBatch";
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
    const sortOrder =
      searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

    const filters: Prisma.ApplicationWhereInput[] = [];

    if (
      status === "PENDING" ||
      status === "APPROVED" ||
      status === "REJECTED"
    ) {
      filters.push({ status });
    }

    const amountFilter: Prisma.IntFilter = {};
    if (minAmount && !isNaN(Number(minAmount))) {
      amountFilter.gte = Number(minAmount);
    }
    if (maxAmount && !isNaN(Number(maxAmount))) {
      amountFilter.lte = Number(maxAmount);
    }
    if (Object.keys(amountFilter).length > 0) {
      filters.push({ amount: amountFilter });
    }

    if (q) {
      const textSearch = await buildApplicationSearchWhere(prisma, q);
      if (textSearch) {
        filters.push(textSearch);
      }
    }

    const where: Prisma.ApplicationWhereInput =
      filters.length > 1 ? { AND: filters } : filters[0] ?? {};

    const orderBy: Prisma.ApplicationOrderByWithRelationInput = {};
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
          paymentFingerprint: true,
          submitterIp: true,
          status: true,
          adminComment: true,
          clientDevice: true,
          createdAt: true,
          updatedAt: true,
          filledMs: true,
          countTowardsTrust: true,
          trustDecreasedAtDecision: true,
          user: {
            select: {
              email: true,
              id: true,
              name: true,
              username: true,
              avatar: true,
              avatarFrame: true,
              hideEmail: true,
              trustDelta: true,
              markedAsDeceiver: true,
            },
          },
          images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
        },
      }),
      prisma.application.count({ where }),
    ]);

    const integrityMap = await buildApplicationIntegrityBatch(items);

    const safeItems = items.map((it) => ({
      ...it,
      story: sanitizeApplicationStoryHtml(it.story),
      integrity: integrityMap.get(it.id) ?? {
        isClean: true,
        verdict: "Заявка чистая",
        reasons: [{ key: "unknown", message: "Проверка недоступна" }],
        submitterIp: it.submitterIp ?? null,
        sameIpCount: 0,
        samePaymentCount: 0,
        links: { sameIp: [], samePayment: [] },
      },
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
