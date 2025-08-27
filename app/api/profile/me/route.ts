// app/api/profile/me/route.ts
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSession();
  if (!session) return Response.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { id: session.uid },
    select: { id: true, email: true, role: true, createdAt: true, name: true },
  });
  return Response.json({ user });
}
