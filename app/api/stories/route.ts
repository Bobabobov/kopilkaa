// app/api/stories/route.ts
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sanitizeEmailForViewer } from "@/lib/privacy";

export const dynamic = "force-dynamic";

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
    const normalizedQuery = q.replace(/\s+/g, " ").trim();

    const statusFilter = {
      OR: [
        { status: "APPROVED" },
        { status: "CONTEST", publishInStories: true },
      ],
    };
    const where: any = { AND: [statusFilter] };
    if (normalizedQuery) {
      const tokens = normalizedQuery.split(" ").filter(Boolean).slice(0, 6);
      const synonymMap: Record<string, string[]> = {
        деньги: ["средства", "помощь", "финансы", "руб", "рубли"],
        срочно: ["срочно", "быстро", "немедленно"],
        помощь: ["поддержка", "средства", "выручка"],
        лечение: ["врачи", "медицина", "больница"],
        ребенок: ["дети", "ребенок", "сын", "дочь"],
      };
      const expandedTokens = tokens.flatMap((token) => {
        const lower = token.toLowerCase();
        return [token, ...(synonymMap[lower] || [])];
      });
      const digitsOnly = normalizedQuery.replace(/[^\d]/g, "");
      const amountFromQuery =
        digitsOnly.length > 0 ? Number(digitsOnly) : null;

      const buildOr = (term: string) => {
        const ors: any[] = [
          { title: { contains: term } },
          { summary: { contains: term } },
          { story: { contains: term } },
          { user: { name: { contains: term } } },
          // Поиск по email — только если пользователь разрешил показывать email
          {
            user: {
              email: { contains: term },
              hideEmail: false,
            },
          },
        ];

        if (/^\d+$/.test(term)) {
          ors.push({ amount: { equals: Number(term) } });
        }

        return ors;
      };

      const phraseOr = buildOr(normalizedQuery);
      const tokenOrs = expandedTokens.length
        ? expandedTokens.flatMap((token) => buildOr(token))
        : [];

      const combinedOr: any[] = [...phraseOr, ...tokenOrs];
      if (amountFromQuery && Number.isFinite(amountFromQuery)) {
        combinedOr.push({ amount: { equals: amountFromQuery } });
      }

      where.AND.push({ OR: combinedOr });
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.application
        .findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
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
            status: true,
            publishInStories: true,
          },
        })
        .catch(() => []),
      prisma.application.count({ where }).catch(() => 0),
    ]);

    let finalItems = items;
    let finalTotal = total;

    if (normalizedQuery && items.length === 0) {
      const normalizeText = (value: string) =>
        value
          .toLowerCase()
          .replace(/[^\p{L}\p{N}]+/gu, " ")
          .replace(/\s+/g, " ")
          .trim();

      const levenshtein = (a: string, b: string) => {
        if (a === b) return 0;
        const matrix = Array.from({ length: a.length + 1 }, () =>
          new Array(b.length + 1).fill(0),
        );
        for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
        for (let i = 1; i <= a.length; i += 1) {
          for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
              matrix[i - 1][j] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j - 1] + cost,
            );
          }
        }
        return matrix[a.length][b.length];
      };

      const queryTokens = normalizedQuery
        ? normalizeText(normalizedQuery).split(" ").filter(Boolean).slice(0, 6)
        : [];
      const synonymMap: Record<string, string[]> = {
        деньги: ["средства", "помощь", "финансы", "руб", "рубли"],
        срочно: ["срочно", "быстро", "немедленно"],
        помощь: ["поддержка", "средства", "выручка"],
        лечение: ["врачи", "медицина", "больница"],
        ребенок: ["дети", "ребенок", "сын", "дочь"],
      };
      const expandedTokens = Array.from(
        new Set(
          queryTokens.flatMap((token) => [
            token,
            ...(synonymMap[token] || []),
          ]),
        ),
      ).filter((token) => token.length >= 2);

      const candidateItems = await prisma.application
        .findMany({
          where: statusFilter,
          orderBy: { createdAt: "desc" },
          take: 500,
          select: {
            id: true,
            title: true,
            summary: true,
            story: true,
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
            status: true,
            publishInStories: true,
          },
        })
        .catch(() => []);

      const amountToken = normalizedQuery.replace(/[^\d]/g, "");
      const amountValue = amountToken ? Number(amountToken) : null;

      const matches = candidateItems
        .map((item) => {
          const fields = [
            item.title,
            item.summary,
            item.story,
            item.user?.name || "",
            item.user?.email || "",
          ];
          const textTokens = fields
            .join(" ")
            .split(" ")
            .map(normalizeText)
            .join(" ")
            .split(" ")
            .filter(Boolean);

          let score = 0;
          for (const token of expandedTokens) {
            const lowerToken = token.toLowerCase();
            if (!lowerToken) continue;
            if (fields.some((field) => normalizeText(field).includes(lowerToken))) {
              score += 3;
              continue;
            }
            const maxDistance = lowerToken.length <= 4 ? 1 : 2;
            const fuzzyHit = textTokens.some(
              (word) => levenshtein(word, lowerToken) <= maxDistance,
            );
            if (fuzzyHit) score += 1;
          }

          if (
            amountValue &&
            Number.isFinite(amountValue) &&
            item.amount === amountValue
          ) {
            score += 4;
          }

          return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);

      finalItems = matches.map((entry) => entry.item).slice(0, limit);
      finalTotal = matches.length;
    }

    // userLiked батчем (без N+1)
    let likedSet: Set<string> | null = null;
    if (viewerId && finalItems.length) {
      const likes = await prisma.storyLike
        .findMany({
          where: {
            userId: viewerId,
            applicationId: { in: finalItems.map((i: any) => i.id) },
          },
          select: { applicationId: true },
        })
        .catch(() => []);
      likedSet = new Set(likes.map((l) => l.applicationId));
    }

    const safeItems = finalItems.map((it: any) => ({
      ...it,
      user: it.user ? sanitizeEmailForViewer(it.user, viewerId || "") : it.user,
      userLiked: likedSet ? likedSet.has(it.id) : false,
      isContestWinner: it.status === "CONTEST" && it.publishInStories,
    }));

    const responseData = {
      page,
      limit,
      total: finalTotal,
      pages: Math.ceil(finalTotal / limit),
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
    return new Response(
      JSON.stringify({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
        items: [],
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
