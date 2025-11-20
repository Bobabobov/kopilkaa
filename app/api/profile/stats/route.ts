import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.uid;

    // Получаем статистику заявок с обработкой ошибок
    const applications = await prisma.application.findMany({
      where: { userId },
      select: {
        status: true,
        amount: true,
      },
    }).catch(() => []);

    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (app) => app.status === "APPROVED",
    ).length;
    const totalAmount = applications
      .filter((app) => app.status === "APPROVED")
      .reduce((sum, app) => sum + app.amount, 0);

    // Получаем количество друзей с обработкой ошибок
    const friendsCount = await prisma.friendship.count({
      where: {
        OR: [
          { requesterId: userId, status: "ACCEPTED" },
          { receiverId: userId, status: "ACCEPTED" },
        ],
      },
    }).catch(() => 0);

    // Получаем статистику игр с обработкой ошибок
    const gameRecords = await prisma.gameRecord.findMany({
      where: { userId },
      select: {
        attempts: true,
        bestScore: true,
      },
    }).catch(() => []);

    const gamesPlayed = gameRecords.reduce(
      (sum, record) => sum + record.attempts,
      0,
    );
    const bestScore = Math.max(
      ...gameRecords.map((record) => record.bestScore || 0),
      0,
    );

    // Получаем детальную статистику заявок
    const applicationsStats = {
      total: totalApplications,
      pending: applications.filter((app) => app.status === "PENDING").length,
      approved: approvedApplications,
      rejected: applications.filter((app) => app.status === "REJECTED").length,
    };

    // Вычисляем дни с регистрации с обработкой ошибок
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    }).catch(() => null);

    const daysSinceRegistration = user
      ? Math.floor(
          (Date.now() - new Date(user.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

    const userStats = {
      daysSinceRegistration,
    };

    const stats = {
      applications: applicationsStats,
      user: userStats,
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Error loading stats:", error);
    // Возвращаем пустую статистику вместо ошибки
    return Response.json({
      applications: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      },
      user: {
        daysSinceRegistration: 0,
      },
    });
  }
}
