"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import Link from "next/link";

interface ActivityItem {
  id: string;
  type: "application" | "donation" | "achievement" | "friend";
  title: string;
  description: string;
  date: string;
  link?: string;
  icon: keyof typeof LucideIcons;
  color: string;
}

export default function ProfileRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        // Получаем данные из разных источников
        const [applicationsRes, donationsRes, achievementsRes] = await Promise.all([
          fetch("/api/applications/mine?limit=3", { cache: "no-store" }).catch(() => null),
          fetch("/api/profile/donations", { cache: "no-store" }).catch(() => null),
          fetch("/api/achievements/user", { cache: "no-store" }).catch(() => null),
        ]);

        const activitiesList: ActivityItem[] = [];

        // Обрабатываем заявки
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

        // Обрабатываем пожертвования
        if (donationsRes?.ok) {
          const donationsData = await donationsRes.json();
          if (donationsData.donations) {
            donationsData.donations.slice(0, 2).forEach((donation: any) => {
              activitiesList.push({
                id: `donation-${donation.id}`,
                type: "donation",
                title: `Пожертвование ${donation.amount}₽`,
                description: donation.comment || "Поддержка проекта",
                date: donation.createdAt,
                icon: "Heart",
                color: "#e16162",
              });
            });
          }
        }

        // Обрабатываем достижения
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

        // Сортируем по дате (новые первые)
        activitiesList.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setActivities(activitiesList.slice(0, 5));
      } catch (error) {
        console.error("Error fetching activity:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Только что";
    if (diffMinutes < 60) return `${diffMinutes} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
    });
  };

  if (loading) {
    return (
      <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 p-4 sm:p-5 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#abd1c6]/20 rounded w-32"></div>
          <div className="space-y-2">
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
            <div className="h-16 bg-[#abd1c6]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
      >
        <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <LucideIcons.Activity className="text-[#abd1c6]" size="sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Недавняя активность</h3>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-5 md:p-6 text-center py-8 sm:py-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#abd1c6]/10 rounded-3xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <LucideIcons.Activity className="text-[#abd1c6]" size="xl" />
          </div>
          <p className="text-sm sm:text-base text-[#abd1c6] font-medium mb-1">Нет активности</p>
          <p className="text-xs sm:text-sm text-[#abd1c6]/60 px-4">
            Ваши действия будут отображаться здесь
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
    >
      {/* Заголовок */}
      <div className="p-4 sm:p-5 md:p-6 border-b border-[#abd1c6]/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#abd1c6]/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <LucideIcons.Activity className="text-[#abd1c6]" size="sm" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-[#fffffe] truncate">Недавняя активность</h3>
            <p className="text-[10px] sm:text-xs text-[#abd1c6] mt-0.5">
              Последние {activities.length} действий
            </p>
          </div>
        </div>
      </div>

      {/* Список активности */}
      <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
        {activities.map((activity, index) => {
          const IconComponent = LucideIcons[activity.icon] || LucideIcons.Circle;
          const content = (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 sm:p-4 bg-[#001e1d]/30 rounded-lg border border-[#abd1c6]/10 hover:border-[${activity.color}]/30 transition-colors ${
                activity.link ? "cursor-pointer" : ""
              }`}
            >
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${activity.color}20`,
                  color: activity.color,
                }}
              >
                <IconComponent size="sm" className="text-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-semibold text-[#fffffe] mb-0.5 truncate">
                  {activity.title}
                </div>
                <div className="text-xs sm:text-sm text-[#abd1c6] mb-1 line-clamp-2">
                  {activity.description}
                </div>
                <div className="text-[10px] sm:text-xs text-[#abd1c6]/60">
                  {formatDate(activity.date)}
                </div>
              </div>
            </motion.div>
          );

          return activity.link ? (
            <Link key={activity.id} href={activity.link}>
              {content}
            </Link>
          ) : (
            <div key={activity.id}>{content}</div>
          );
        })}
      </div>
    </motion.div>
  );
}

