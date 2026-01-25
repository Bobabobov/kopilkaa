// app/api/auth/check-email/route.ts
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "";
  if (!email)
    return Response.json(
      { ok: false, error: "email required" },
      { status: 400 },
    );
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return Response.json({ exists: !!existing });
}
