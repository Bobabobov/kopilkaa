// app/api/profile/activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.uid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Получаем различные типы активности пользователя
    const activities: any[] = [];

    try {
      // 1. Созданные заявки
      const recentApplications = await prisma.application.findMany({
        where: { userId: session.uid },
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }).catch(() => []);

      recentApplications.forEach(app => {
        if (app.status === 'PENDING') {
          activities.push({
            id: `app_created_${app.id}`,
            type: 'application_created',
            title: 'Создана новая заявка',
            description: `"${app.title}"`,
            createdAt: app.createdAt,
            data: { applicationId: app.id },
          });
        } else if (app.status === 'APPROVED') {
          activities.push({
            id: `app_approved_${app.id}`,
            type: 'application_approved',
            title: 'Заявка одобрена!',
            description: `"${app.title}" была одобрена администратором`,
            createdAt: app.createdAt,
            data: { applicationId: app.id },
          });
        } else if (app.status === 'REJECTED') {
          activities.push({
            id: `app_rejected_${app.id}`,
            type: 'application_rejected',
            title: 'Заявка отклонена',
            description: `"${app.title}" была отклонена`,
            createdAt: app.createdAt,
            data: { applicationId: app.id },
          });
        }
      });

      // 2. Лайки (поставленные пользователем)
      const recentLikes = await prisma.storyLike.findMany({
        where: { userId: session.uid },
        select: {
          id: true,
          createdAt: true,
          application: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 3,
      }).catch(() => []);

      recentLikes.forEach(like => {
        if (like.application) {
          activities.push({
            id: `like_${like.id}`,
            type: 'like',
            title: 'Поставлен лайк',
            description: `На заявку "${like.application.title}"`,
            createdAt: like.createdAt,
            data: { applicationId: like.application.id },
          });
        }
      });

      // 3. Добавленные друзья
      const recentFriends = await prisma.friendship.findMany({
        where: {
          OR: [
            { requesterId: session.uid, status: 'ACCEPTED' },
            { receiverId: session.uid, status: 'ACCEPTED' },
          ],
        },
        select: {
          id: true,
          createdAt: true,
          requester: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          requesterId: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 2,
      }).catch(() => []);

      recentFriends.forEach(friendship => {
        const friend = friendship.requesterId === session.uid 
          ? friendship.receiver 
          : friendship.requester;
        
        if (friend) {
          activities.push({
            id: `friend_${friendship.id}`,
            type: 'friend_added',
            title: 'Новый друг',
            description: `${friend.name || friend.email} добавлен в друзья`,
            createdAt: friendship.createdAt,
            data: { 
              friendId: friend.id,
              friendName: friend.name || friend.email,
            },
          });
        }
      });

    } catch (dbError) {
      console.warn("Database error in activity API, returning empty activities:", dbError);
    }

    // Сортируем все активности по дате и берем последние
    const sortedActivities = activities
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return NextResponse.json(
      { activities: sortedActivities },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user activity:", error);
    // Возвращаем пустой массив вместо ошибки
    return NextResponse.json(
      { activities: [] },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  }
}
