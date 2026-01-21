import { useEffect, useMemo, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

export interface DetailedStats {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
    approvalRate: number;
  };
  activity: {
    likesGiven: number;
    likesReceived: number;
    friendsCount: number;
    daysActive: number;
  };
  achievements: {
    total: number;
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  user: {
    createdAt: string;
  };
}

interface ApiResponse {
  detailedStats: DetailedStats;
}

const getRussianPlural = (count: number, forms: [string, string, string]): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
};

export type StatsTabId = "overview" | "applications" | "social" | "achievements";

export type PersonalTabs = { id: StatsTabId; label: string; icon: typeof LucideIcons[keyof typeof LucideIcons] };

export interface PersonalStatsViewModel {
  stats: DetailedStats;
  achievementsLabel: string;
  friendsLabel: string;
  totalApplications: number;
  approvedPercent: number;
  rejectedPercent: number;
  pendingPercent: number;
  successHint: string;
  tabs: PersonalTabs[];
}

export function usePersonalStats() {
  const [data, setData] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StatsTabId>("overview");

  useEffect(() => {
    const fetchDetailedStats = async () => {
      try {
        const response = await fetch("/api/profile/detailed-stats", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result: ApiResponse = await response.json();
        if (result.detailedStats) {
          setData(result.detailedStats);
        } else {
          throw new Error("No detailed stats in response");
        }
      } catch (err: any) {
        console.error("Error fetching detailed stats:", err);
        setError(err?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedStats();
  }, []);

  const calculated = useMemo<PersonalStatsViewModel | null>(() => {
    if (!data) return null;
    const stats = {
      applications: data.applications,
      activity: data.activity,
      achievements: data.achievements,
      user: data.user,
    };

    const achievementsLabel = getRussianPlural(stats.achievements.total, [
      "Достижение",
      "Достижения",
      "Достижений",
    ]);
    const friendsLabel = getRussianPlural(stats.activity.friendsCount, ["Друг", "Друга", "Друзей"]);

    const totalApplications = stats.applications.total || 0;
    const approvedPercent = totalApplications
      ? Math.round((stats.applications.approved / totalApplications) * 100)
      : 0;
    const rejectedPercent = totalApplications
      ? Math.round((stats.applications.rejected / totalApplications) * 100)
      : 0;
    const pendingPercent = totalApplications
      ? Math.round((stats.applications.pending / totalApplications) * 100)
      : 0;

    const successHint = (() => {
      if (totalApplications === 0) {
        return "Создайте первую заявку и проверьте, как быстро её увидит админ.";
      }
      if (totalApplications < 3) {
        return stats.applications.approved === totalApplications
          ? "Все ваши заявки одобрены — отличный старт!"
          : "Пока мало данных, но каждая подробная история повышает шанс на одобрение.";
      }
      if (approvedPercent >= 80) {
        return "Отличный результат: большинство ваших заявок одобряют. Продолжайте в том же духе!";
      }
      if (approvedPercent >= 60) {
        return "Хороший уровень одобрения. Ещё немного точнее формулируйте цель и сумму — и процент станет ещё выше.";
      }
      if (approvedPercent >= 40) {
        return "Есть куда расти. Попробуйте подробнее описывать цель и прикладывать доказательства — это повышает шанс одобрения.";
      }
      return "Почти все заявки отклоняются. Проверьте правила, уточните сумму и покажите, зачем именно нужны деньги.";
    })();

    const tabs = [
      { id: "overview" as const, label: "Обзор", icon: LucideIcons.PieChart },
      { id: "applications" as const, label: "Заявки", icon: LucideIcons.FileText },
      { id: "social" as const, label: "Социальное", icon: LucideIcons.Users },
      { id: "achievements" as const, label: "Достижения", icon: LucideIcons.Award },
    ];

    return {
      stats,
      achievementsLabel,
      friendsLabel,
      totalApplications,
      approvedPercent,
      rejectedPercent,
      pendingPercent,
      successHint,
      tabs,
    };
  }, [data]);

  return {
    loading,
    error,
    activeTab,
    setActiveTab,
    calculated,
  };
}
