import { useEffect, useState } from "react";

export type ActivityItem = {
  id: string;
  type: "application" | "donation" | "achievement" | "friend";
  title: string;
  description: string;
  date: string;
  link?: string;
  icon: string;
  color: string;
};

const formatRub = (amount: number) => {
  const n = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 })
    .format(amount)
    .replace(/\u00A0/g, " ");
  return `${n} ₽`;
};

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const [applicationsRes, donationsRes, achievementsRes] = await Promise.all([
          fetch("/api/applications/mine?limit=3", { cache: "no-store" }).catch(() => null),
          fetch("/api/profile/donations", { cache: "no-store" }).catch(() => null),
          fetch("/api/achievements/user", { cache: "no-store" }).catch(() => null),
        ]);

        const activitiesList: ActivityItem[] = [];

        if (applicationsRes?.ok) {
          const appsData = await applicationsRes.json();
          if (appsData.applications) {
            appsData.applications.slice(0, 2).forEach((app: any) => {
              const statusText =
                app.status === "APPROVED"
                  ? "одобрена"
                  : app.status === "PENDING"
                    ? "на рассмотрении"
                    : "отклонена";
              activitiesList.push({
                id: `app-${app.id}`,
                type: "application",
                title: app.title || "Заявка",
                description: `Заявка ${statusText}`,
                date: app.createdAt || app.updatedAt,
                link: `/applications/${app.id}`,
                icon: "FileText",
                color: "#f9bc60",
              });
            });
          }
        }

        if (donationsRes?.ok) {
          const donationsData = await donationsRes.json();
          if (donationsData.donations) {
            donationsData.donations.slice(0, 2).forEach((donation: any) => {
              const raw = typeof donation.comment === "string" ? donation.comment.trim() : "";
              const serviceLabel = raw === "heroes_placement" ? "Размещение в «Героях»" : raw;
              activitiesList.push({
                id: `donation-${donation.id}`,
                type: "donation",
                title: `Оплата ${formatRub(Number(donation.amount) || 0)}`,
                description: serviceLabel || "Оплата цифровой услуги",
                date: donation.createdAt,
                icon: "CreditCard",
                color: "#f9bc60",
              });
            });
          }
        }

        if (achievementsRes?.ok) {
          const achievementsData = await achievementsRes.json();
          if (achievementsData.success && achievementsData.data?.achievements) {
            achievementsData.data.achievements
              .filter((a: any) => a.unlockedAt)
              .slice(0, 2)
              .forEach((achievement: any) => {
                activitiesList.push({
                  id: `achievement-${achievement.id}`,
                  type: "achievement",
                  title: achievement.achievement?.name || "Достижение",
                  description: "Получено новое достижение",
                  date: achievement.unlockedAt,
                  icon: "Award",
                  color: "#f9bc60",
                });
              });
          }
        }

        activitiesList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(activitiesList.slice(0, 5));
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  return { activities, loading };
}
