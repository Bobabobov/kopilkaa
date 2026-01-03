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

async function resolveUserId(identifierRaw: string): Promise<string | null> {
  const identifier = normalizeIdentifier(identifierRaw);
  if (!identifier) return null;

  if (identifier.startsWith("@")) {
    const username = normalizeUsername(identifier);
    if (!username) return null;
    const u = await prisma.user.findUnique({ where: { username }, select: { id: true } });
    return u?.id ?? null;
  }

  const byId = await prisma.user.findUnique({ where: { id: identifier }, select: { id: true } });
  if (byId?.id) return byId.id;

  const username = normalizeUsername(identifier);
  if (!username) return null;
  const byUsername = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  return byUsername?.id ?? null;
}

// POST /api/admin/heroes/visibility
// Body: { identifier: "@username" | "userId", hide: boolean }
export async function POST(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const identifier = normalizeIdentifier(body?.identifier);
    const hide = Boolean(body?.hide);

    if (!identifier) {
      return NextResponse.json({ error: "Укажите пользователя (@username или userId)" }, { status: 400 });
    }

    const userId = await resolveUserId(identifier);
    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // NOTE: On some Windows setups Prisma Client binary can be locked (EPERM) and `prisma generate`
    // may fail, leaving TS types stale. We intentionally relax typing here to keep builds stable.
    const user = await (prisma.user as any).update({
      where: { id: userId },
      data: { hideFromHeroes: hide },
      select: { id: true, username: true, name: true, email: true, hideFromHeroes: true },
    });

    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    console.error("admin heroes visibility error:", error);
    return NextResponse.json({ error: "Ошибка обновления видимости" }, { status: 500 });
  }
}


