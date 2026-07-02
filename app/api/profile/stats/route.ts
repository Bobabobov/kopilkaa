import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getAuthUser(request);
    if (!session)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userId = session.uid;

    const applications = await prisma.application
      .findMany({
        where: { userId },
        select: {
          status: true,
          amount: true,
        },
      })
      .catch(() => []);

    const totalApplications = applications.length;
    const approvedApplications = applications.filter(
      (app) => app.status === "APPROVED",
    ).length;
    const pendingApplications = applications.filter(
      (app) => app.status === "PENDING",
    ).length;
    const rejectedApplications = applications.filter(
      (app) => app.status === "REJECTED",
    ).length;
    const totalAmount = applications
      .filter((app) => app.status === "APPROVED")
      .reduce((sum, app) => sum + app.amount, 0);

    const friendsCount = await prisma.friendship
      .count({
        where: {
          OR: [
            { requesterId: userId, status: "ACCEPTED" },
            { receiverId: userId, status: "ACCEPTED" },
          ],
        },
      })
      .catch(() => 0);

    const applicationsStats = {
      total: totalApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
    };

    const user = await prisma.user
      .findUnique({
        where: { id: userId },
        select: { createdAt: true },
      })
      .catch(() => null);

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
      totalApplications,
      approvedApplications,
      effectiveApprovedApplications: approvedApplications,
      pendingApplications,
      rejectedApplications,
      approvedAmount: totalAmount,
      friendsCount,
    };

    return Response.json(stats);
  } catch (error) {
    console.error("Error loading stats:", error);
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
      totalApplications: 0,
      approvedApplications: 0,
      effectiveApprovedApplications: 0,
      pendingApplications: 0,
      rejectedApplications: 0,
      approvedAmount: 0,
      friendsCount: 0,
    });
  }
}
