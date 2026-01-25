// app/api/auth/phone/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attachSessionToResponse } from "@/lib/auth";

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]+/g, "");
  if (!digits) return null;

  if (digits.length === 10) {
    return `7${digits}`;
  }
  if (
    digits.length === 11 &&
    (digits.startsWith("7") || digits.startsWith("8"))
  ) {
    return `7${digits.slice(1)}`;
  }
  if (digits.length >= 7 && digits.length <= 15) {
    return digits;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const phoneRaw = typeof body.phone === "string" ? body.phone : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    const normalized = normalizePhone(phoneRaw);
    if (!normalized) {
      return NextResponse.json(
        { success: false, error: "Введите корректный номер телефона" },
        { status: 400 },
      );
    }

    if (!code || !/^\d{4,6}$/.test(code)) {
      return NextResponse.json(
        { success: false, error: "Код введён некорректно" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone: normalized },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Пользователь с таким телефоном не найден" },
        { status: 404 },
      );
    }

    const existingCode = await prisma.phoneLoginCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!existingCode) {
      return NextResponse.json(
        { success: false, error: "Неверный или просроченный код" },
        { status: 400 },
      );
    }

    await prisma.phoneLoginCode.update({
      where: { id: existingCode.id },
      data: { used: true },
    });

    // помечаем телефон как подтверждённый
    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerified: true },
    });

    const res = NextResponse.json({ success: true });
    attachSessionToResponse(
      res,
      { uid: user.id, role: (user.role as any) || "USER" },
      req,
    );
    return res;
  } catch (error) {
    console.error("Error in /api/auth/phone/verify:", error);
    return NextResponse.json(
      { success: false, error: "Ошибка проверки кода" },
      { status: 500 },
    );
  }
}
