import { NextResponse } from "next/server";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const submissions = await prisma.goodDeedSubmission.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        taskTitle: true,
        taskDescription: true,
        storyText: true,
        reward: true,
        weekKey: true,
        status: true,
        adminComment: true,
        reviewedAt: true,
        createdAt: true,
        media: {
          orderBy: { sort: "asc" },
          select: { url: true, type: true },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            email: true,
            vkLink: true,
            telegramLink: true,
            youtubeLink: true,
          },
        },
      },
    });

    return NextResponse.json({
      items: submissions.map((item) => ({
        id: item.id,
        taskTitle: item.taskTitle,
        taskDescription: item.taskDescription,
        storyText: item.storyText || "",
        reward: item.reward,
        weekKey: item.weekKey,
        status: item.status,
        adminComment: item.adminComment,
        reviewedAt: item.reviewedAt,
        createdAt: item.createdAt,
        media: item.media,
        user: {
          id: item.user.id,
          name: item.user.name || item.user.username || "Пользователь",
          username: item.user.username,
          avatar: item.user.avatar,
          email: item.user.email,
          vkLink: item.user.vkLink,
          telegramLink: item.user.telegramLink,
          youtubeLink: item.user.youtubeLink,
        },
      })),
    });
  } catch (error) {
    console.error("GET /api/admin/good-deeds/submissions error:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить задания для модерации" },
      { status: 500 },
    );
  }
}
