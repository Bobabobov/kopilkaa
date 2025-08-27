// app/api/stories/[id]/route.ts
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params: { id } }: { params: { id: string } }) {
  const item = await prisma.application.findFirst({
    where: { id, status: "APPROVED" },
    select: {
      id: true, title: true, summary: true, story: true, createdAt: true,
      images: { orderBy: { sort: "asc" }, select: { url: true, sort: true } },
    },
  });
  if (!item) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ item });
}
