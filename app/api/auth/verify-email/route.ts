import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { attachSessionToResponse } from "@/lib/auth";
import { verifyEmailVerificationToken } from "@/lib/emailVerification";
import { getPublicOriginFromRequest } from "@/lib/siteUrl";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token")?.trim() || "";
    const site = getPublicOriginFromRequest(req);

    const fail = (code: string) =>
      NextResponse.redirect(
        new URL(`/verify-email?error=${encodeURIComponent(code)}`, site),
      );

    if (!token) {
      return fail("missing_token");
    }

    const verified = await verifyEmailVerificationToken(token);
    if (!verified) {
      return fail("invalid_or_expired");
    }

    const user = await prisma.user.findUnique({
      where: { id: verified.userId },
      select: { id: true, role: true },
    });

    if (!user) {
      return fail("invalid_or_expired");
    }

    const target = new URL("/profile", site);
    const res = NextResponse.redirect(target);
    attachSessionToResponse(
      res,
      { uid: user.id, role: (user.role as "USER" | "ADMIN") || "USER" },
      req,
    );
    return res;
  } catch (err) {
    console.error("[API Error] /api/auth/verify-email:", err);
    const site = getPublicOriginFromRequest(req);
    return NextResponse.redirect(new URL("/verify-email?error=server", site));
  }
}
