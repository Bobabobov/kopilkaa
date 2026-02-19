// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { ApplicationStatus } from "@prisma/client";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import { prisma } from "@/lib/db";
import { getTrustLevelFromEffectiveApproved } from "@/lib/trustLevel";

export const dynamic = "force-dynamic";

type UserRef = { id: string; email: string | null; name: string | null };

function paymentDigits(s: string): string {
  return (s ?? "").replace(/\D/g, "");
}

// GET /api/admin/users - получить список пользователей для админа
export async function GET(request: Request) {
  try {
    const admin = await getAllowedAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit") || 20)),
    );
    const q = (searchParams.get("q") || "").trim();
    const withLinks = searchParams.get("withLinks") === "1";

    const where: any = {};
    if (q) {
      where.OR = [{ name: { contains: q } }, { email: { contains: q } }];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          lastSeen: true,
          role: true,
          trustDelta: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    const userIds = users.map((user) => user.id);

    const [
      effectiveGroups,
      approvedTotalGroups,
      rejectedTotalGroups,
      rejectedWithDecreaseGroups,
      approvedNotCountingGroups,
    ] = userIds.length
      ? await Promise.all([
          prisma.application.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.APPROVED,
              countTowardsTrust: true,
            },
            _count: { _all: true },
          }),
          prisma.application.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.APPROVED,
            },
            _count: { _all: true },
          }),
          prisma.application.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.REJECTED,
            },
            _count: { _all: true },
          }),
          prisma.application.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.REJECTED,
              trustDecreasedAtDecision: true,
            },
            _count: { _all: true },
          }),
          prisma.application.groupBy({
            by: ["userId"],
            where: {
              userId: { in: userIds },
              status: ApplicationStatus.APPROVED,
              countTowardsTrust: false,
            },
            _count: { _all: true },
          }),
        ])
      : [[], [], [], [], []];

    const effectiveMap = new Map<string, number>();
    (effectiveGroups as any[]).forEach((group: any) => {
      effectiveMap.set(group.userId, group._count?._all ?? 0);
    });
    const approvedTotalMap = new Map<string, number>();
    (approvedTotalGroups as any[]).forEach((group: any) => {
      approvedTotalMap.set(group.userId, group._count?._all ?? 0);
    });
    const rejectedTotalMap = new Map<string, number>();
    (rejectedTotalGroups as any[]).forEach((group: any) => {
      rejectedTotalMap.set(group.userId, group._count?._all ?? 0);
    });
    const rejectedWithDecreaseMap = new Map<string, number>();
    (rejectedWithDecreaseGroups as any[]).forEach((group: any) => {
      rejectedWithDecreaseMap.set(group.userId, group._count?._all ?? 0);
    });
    const approvedNotCountingMap = new Map<string, number>();
    (approvedNotCountingGroups as any[]).forEach((group: any) => {
      approvedNotCountingMap.set(group.userId, group._count?._all ?? 0);
    });

    let usersWithTrust = users.map((user) => {
      const effectiveApprovedApplications = effectiveMap.get(user.id) ?? 0;
      const trustDelta = user.trustDelta ?? 0;
      const approvedTotal = approvedTotalMap.get(user.id) ?? 0;
      const approvedCounting = effectiveApprovedApplications;
      const approvedWithoutLevel = approvedNotCountingMap.get(user.id) ?? 0;
      const rejectedTotal = rejectedTotalMap.get(user.id) ?? 0;
      const rejectedWithLevelDecrease =
        rejectedWithDecreaseMap.get(user.id) ?? 0;
      const trustScore = approvedCounting - rejectedWithLevelDecrease;
      return {
        ...user,
        effectiveApprovedApplications,
        trustLevel: getTrustLevelFromEffectiveApproved(
          effectiveApprovedApplications,
          trustDelta,
        ),
        levelStats: {
          approvedTotal,
          approvedCounting,
          approvedWithoutLevel,
          rejectedTotal,
          rejectedWithLevelDecrease,
          trustScore,
        },
      };
    });

    if (withLinks && userIds.length > 0) {
      const apps = await prisma.application.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, payment: true, submitterIp: true },
      });

      const paymentDigitsToUserIds = new Map<string, Set<string>>();
      const ipToUserIds = new Map<string, Set<string>>();
      for (const app of apps) {
        const digits = paymentDigits(app.payment);
        if (digits.length >= 10) {
          let set = paymentDigitsToUserIds.get(digits);
          if (!set) {
            set = new Set();
            paymentDigitsToUserIds.set(digits, set);
          }
          set.add(app.userId);
        }
        if (app.submitterIp && app.submitterIp.trim() !== "") {
          let set = ipToUserIds.get(app.submitterIp);
          if (!set) {
            set = new Set();
            ipToUserIds.set(app.submitterIp, set);
          }
          set.add(app.userId);
        }
      }

      const userApps = new Map<string, typeof apps>();
      for (const app of apps) {
        const list = userApps.get(app.userId) ?? [];
        list.push(app);
        userApps.set(app.userId, list);
      }

      const linkedIds = new Set<string>();
      const linksByUserId = new Map<
        string,
        { samePayment: string[]; sameIp: string[] }
      >();
      for (const user of usersWithTrust) {
        const userApplications = userApps.get(user.id) ?? [];
        const myPaymentDigits = new Set<string>();
        const myIps = new Set<string>();
        for (const app of userApplications) {
          const d = paymentDigits(app.payment);
          if (d.length >= 10) myPaymentDigits.add(d);
          if (app.submitterIp?.trim()) myIps.add(app.submitterIp);
        }
        const samePaymentIds = new Set<string>();
        const sameIpIds = new Set<string>();
        for (const d of myPaymentDigits) {
          const uids = paymentDigitsToUserIds.get(d);
          if (uids) for (const uid of uids) if (uid !== user.id) samePaymentIds.add(uid);
        }
        for (const ip of myIps) {
          const uids = ipToUserIds.get(ip);
          if (uids) for (const uid of uids) if (uid !== user.id) sameIpIds.add(uid);
        }
        const samePaymentArr = [...samePaymentIds].slice(0, 15);
        const sameIpArr = [...sameIpIds].slice(0, 15);
        linksByUserId.set(user.id, {
          samePayment: samePaymentArr,
          sameIp: sameIpArr,
        });
        samePaymentArr.forEach((id) => linkedIds.add(id));
        sameIpArr.forEach((id) => linkedIds.add(id));
      }

      const linkedUsers: UserRef[] =
        linkedIds.size > 0
          ? await prisma.user.findMany({
              where: { id: { in: [...linkedIds] } },
              select: { id: true, email: true, name: true },
            })
          : [];
      const linkedMap = new Map(linkedUsers.map((u) => [u.id, u]));

      usersWithTrust = usersWithTrust.map((user) => {
        const links = linksByUserId.get(user.id);
        if (!links) return { ...user, links: { samePayment: [], sameIp: [] } };
        return {
          ...user,
          links: {
            samePayment: links.samePayment.map(
              (id) => linkedMap.get(id) ?? { id, email: null, name: null },
            ),
            sameIp: links.sameIp.map(
              (id) => linkedMap.get(id) ?? { id, email: null, name: null },
            ),
          },
        };
      });
    }

    return NextResponse.json({
      success: true,
      data: usersWithTrust,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Ошибка получения списка пользователей" },
      { status: 500 },
    );
  }
}
