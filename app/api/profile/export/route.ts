import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.uid;

    // Получаем все данные пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastSeen: true,
        applications: {
          select: {
            id: true,
            title: true,
            summary: true,
            story: true,
            amount: true,
            payment: true,
            status: true,
            adminComment: true,
            createdAt: true,
            images: {
              select: {
                url: true,
                sort: true,
              },
            },
          },
        },
        gameScores: {
          select: {
            gameKey: true,
            weekKey: true,
            score: true,
            displayName: true,
            createdAt: true,
          },
        },
        userTree: {
          select: {
            level: true,
            streak: true,
            maxStreak: true,
            totalWatered: true,
            lastWatered: true,
            treeType: true,
            potType: true,
            background: true,
            decorations: true,
            isCustomized: true,
            customizedAt: true,
            createdAt: true,
          },
        },
        userAchievements: {
          select: {
            unlockedAt: true,
            grantedBy: true,
            grantedByName: true,
            achievement: {
              select: {
                name: true,
                description: true,
                icon: true,
                rarity: true,
                type: true,
              },
            },
          },
        },
        friendshipsSent: {
          select: {
            status: true,
            createdAt: true,
            receiver: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        friendshipsReceived: {
          select: {
            status: true,
            createdAt: true,
            requester: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Формируем данные для экспорта
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        lastSeen: user.lastSeen,
      },
      applications: user.applications,
      gameScores: user.gameScores,
      tree: user.userTree,
      achievements: user.userAchievements,
      friendships: {
        sent: user.friendshipsSent,
        received: user.friendshipsReceived,
      },
      exportedAt: new Date().toISOString(),
      exportedBy: "Kopilka App",
    };

    // Возвращаем JSON файл
    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="kopilka-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
