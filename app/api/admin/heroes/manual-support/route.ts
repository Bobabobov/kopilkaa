import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";

function normalizeIdentifier(raw: unknown): string {
  return String(raw ?? "").trim();
}

function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@+/, "").toLowerCase();
}

async function resolveUserIdForAdmin(
  identifierRaw: string,
): Promise<string | null> {
  const identifier = normalizeIdentifier(identifierRaw);
  if (!identifier) return null;

  // 1) If starts with @ -> username
  if (identifier.startsWith("@")) {
    const username = normalizeUsername(identifier);
    if (!username) return null;
    const u = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });
    return u?.id ?? null;
  }

  // 2) Try as id
  const byId = await prisma.user.findUnique({
    where: { id: identifier },
    select: { id: true },
  });
  if (byId?.id) return byId.id;

  // 3) As a convenience for admin: allow raw username without @
  const username = normalizeUsername(identifier);
  if (!username) return null;
  const byUsername = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return byUsername?.id ?? null;
}

// POST /api/admin/heroes/manual-support
// Creates SUPPORT donations for a user so they appear in /heroes.
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const identifier = normalizeIdentifier(body?.identifier);
    const totalAmount = Math.floor(Number(body?.totalAmount));
    const paymentsCount = Math.floor(Number(body?.paymentsCount ?? 1));
    const source = normalizeIdentifier(body?.source) || "manual";
    const note = normalizeIdentifier(body?.note);

    if (!identifier) {
      return NextResponse.json(
        { error: "Укажите пользователя (@username или userId)" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return NextResponse.json(
        { error: "Некорректная сумма" },
        { status: 400 },
      );
    }
    if (
      !Number.isFinite(paymentsCount) ||
      paymentsCount <= 0 ||
      paymentsCount > 50
    ) {
      return NextResponse.json(
        { error: "Некорректное количество платежей (1-50)" },
        { status: 400 },
      );
    }
    if (paymentsCount > totalAmount) {
      return NextResponse.json(
        {
          error:
            "Количество платежей не может превышать сумму (count ≤ amount)",
        },
        { status: 400 },
      );
    }

    const userId = await resolveUserIdForAdmin(identifier);
    if (!userId) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, name: true, email: true },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 },
      );
    }

    const base = Math.floor(totalAmount / paymentsCount);
    const remainder = totalAmount - base * paymentsCount;
    const amounts = Array.from({ length: paymentsCount }, (_, idx) =>
      idx === 0 ? base + remainder : base,
    );

    const commentParts = [
      "manual_admin_support",
      `source=${source}`,
      `by=${admin.email}`,
      note ? `note=${note}` : null,
    ].filter(Boolean);
    const comment = commentParts.join(" | ").slice(0, 500);

    const created = await prisma.$transaction(
      amounts.map((amount) =>
        prisma.donation.create({
          data: {
            userId: user.id,
            type: "SUPPORT",
            amount,
            comment,
          },
          select: { id: true, amount: true },
        }),
      ),
    );

    return NextResponse.json({
      success: true,
      data: {
        user,
        created,
      },
    });
  } catch (error) {
    console.error("admin manual-support error:", error);
    return NextResponse.json(
      { error: "Ошибка создания записи поддержки" },
      { status: 500 },
    );
  }
}
