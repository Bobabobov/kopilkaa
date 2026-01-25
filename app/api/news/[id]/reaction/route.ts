// app/api/news/[id]/reaction/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

type ReactionInput = "like" | "dislike" | "none";

function toDbType(input: Exclude<ReactionInput, "none">) {
  return input === "like" ? "LIKE" : "DISLIKE";
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session?.uid) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const postId = params.id;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      reaction?: ReactionInput;
    };
    const reaction = body.reaction;
    if (reaction !== "like" && reaction !== "dislike" && reaction !== "none") {
      return NextResponse.json(
        { error: "Некорректная реакция" },
        { status: 400 },
      );
    }

    const post = await prisma.projectNewsPost.findFirst({
      where: { id: postId, isPublished: true },
      select: { id: true },
    });
    if (!post) {
      return NextResponse.json(
        { error: "Новость не найдена" },
        { status: 404 },
      );
    }

    const userId = session.uid;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.projectNewsReaction.findUnique({
        where: { postId_userId: { postId, userId } },
        select: { id: true, type: true },
      });

      let likesDelta = 0;
      let dislikesDelta = 0;
      let myReaction: "LIKE" | "DISLIKE" | null = null;

      if (!existing) {
        // create
        if (reaction === "none") {
          myReaction = null;
        } else {
          const nextType = toDbType(reaction);
          await tx.projectNewsReaction.create({
            data: { postId, userId, type: nextType as any },
          });
          if (nextType === "LIKE") likesDelta += 1;
          else dislikesDelta += 1;
          myReaction = nextType;
        }
      } else {
        // toggle/update/delete
        if (reaction === "none") {
          await tx.projectNewsReaction.delete({ where: { id: existing.id } });
          if (existing.type === "LIKE") likesDelta -= 1;
          else dislikesDelta -= 1;
          myReaction = null;
        } else {
          const nextType = toDbType(reaction);
          if (existing.type === nextType) {
            // toggle off
            await tx.projectNewsReaction.delete({ where: { id: existing.id } });
            if (existing.type === "LIKE") likesDelta -= 1;
            else dislikesDelta -= 1;
            myReaction = null;
          } else {
            // switch
            await tx.projectNewsReaction.update({
              where: { id: existing.id },
              data: { type: nextType as any },
            });
            if (existing.type === "LIKE") likesDelta -= 1;
            else dislikesDelta -= 1;
            if (nextType === "LIKE") likesDelta += 1;
            else dislikesDelta += 1;
            myReaction = nextType;
          }
        }
      }

      const updated = await tx.projectNewsPost.update({
        where: { id: postId },
        data: {
          likesCount: { increment: likesDelta },
          dislikesCount: { increment: dislikesDelta },
        },
        select: { likesCount: true, dislikesCount: true },
      });

      return { ...updated, myReaction };
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("POST /api/news/[id]/reaction error:", error);
    return NextResponse.json({ error: "Ошибка реакции" }, { status: 500 });
  }
}
