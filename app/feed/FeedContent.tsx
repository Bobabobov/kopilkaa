"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { useNotifications } from "@/components/notifications/hooks/useNotifications";
import { Notification } from "@/components/notifications/types";
import { isNotificationUnread } from "@/components/notifications/utils";
import FeedHeader from "@/components/feed/FeedHeader";
import FeedFilters, { FilterType } from "@/components/feed/FeedFilters";
import NotificationGroup from "@/components/feed/NotificationGroup";

// Импортируем список фильтров для отображения текста
const filters = [
  { type: "all" as FilterType, label: "Все" },
  { type: "unread" as FilterType, label: "Непрочитанные" },
  { type: "like" as FilterType, label: "Лайки" },
  { type: "achievement" as FilterType, label: "Достижения" },
  { type: "friend_request" as FilterType, label: "Друзья" },
  { type: "application_status" as FilterType, label: "Заявки" },
];

export default function FeedContent() {
  const router = useRouter();
  const { notifications, loading, lastViewedTimestamp, refetch, markAsViewed } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  
  // Фильтрация и группировка уведомлений
  const { filteredNotifications, groupedNotifications, unreadCount } = useMemo(() => {
    // Фильтрация
    let filtered: Notification[] = [];
    
    // Применяем фильтры
    if (activeFilter === "all") {
      filtered = [...notifications];
    } else if (activeFilter === "unread") {
      filtered = notifications.filter(n => isNotificationUnread(n, lastViewedTimestamp));
    } else {
      // Фильтруем по типу - строгое сравнение типов
      filtered = notifications.filter(n => {
        // Проверяем точное совпадение типа
        return n.type === activeFilter;
      });
    }
    
    // Сортируем: сначала непрочитанные, потом по дате (новые сначала)
    filtered.sort((a, b) => {
      const aUnread = isNotificationUnread(a, lastViewedTimestamp);
      const bUnread = isNotificationUnread(b, lastViewedTimestamp);
      
      // Непрочитанные всегда выше
      if (aUnread && !bUnread) return -1;
      if (!aUnread && bUnread) return 1;
      
      // Если оба прочитаны или непрочитаны, сортируем по дате
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // Ограничиваем до 15 уведомлений максимум
    filtered = filtered.slice(0, 15);
    
    // Подсчет непрочитанных из всех уведомлений
    const unread = notifications.filter(n => isNotificationUnread(n, lastViewedTimestamp)).length;
    
    // Группировка по датам
    const grouped: Record<string, Notification[]> = {};
    filtered.forEach(notification => {
      const date = new Date(notification.createdAt).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    
    // Сортируем даты (новые сначала)
    const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    
    return {
      filteredNotifications: filtered,
      groupedNotifications: sortedDates.map(date => ({ date, notifications: grouped[date] })),
      unreadCount: unread
    };
  }, [notifications, activeFilter, lastViewedTimestamp]);
  
  // Автоматическое обновление уведомлений каждые 30 секунд
  React.useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 секунд
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  // Обновление при возврате фокуса на страницу
  React.useEffect(() => {
    const handleFocus = () => {
      refetch();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch]);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "application_status" && notification.applicationId) {
      if (notification.status === "APPROVED") {
        router.push(`/stories/${notification.applicationId}`);
      } else {
        router.push("/applications");
      }
    } else if (notification.type === "like" && notification.applicationId) {
      router.push(`/stories/${notification.applicationId}`);
    } else if (notification.type === "friend_request") {
      router.push("/friends?tab=received");
    }
  };

  const handleMarkAllAsRead = () => {
    markAsViewed();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <UniversalBackground />

      {/* Декоративные элементы фона */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#abd1c6]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f9bc60]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 xl:px-12 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24">
        {/* Заголовок */}
        <FeedHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          onMarkAllAsRead={handleMarkAllAsRead}
          hasUnread={unreadCount > 0}
        />

        {/* Основная область с уведомлениями */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 sm:py-24 lg:py-32"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#abd1c6]/10 border border-[#abd1c6]/20 mb-6"
              >
                <LucideIcons.Loader2 className="text-[#f9bc60]" size="lg" />
              </motion.div>
              <p className="text-sm sm:text-base text-[#abd1c6]/60">
                Загрузка уведомлений...
              </p>
            </motion.div>
          ) : (
            <>
              {/* Фильтры - показываем всегда */}
              <FeedFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                unreadCount={unreadCount}
              />

              {/* Результаты фильтрации */}
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 sm:py-24 lg:py-32"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#abd1c6]/10 border border-[#abd1c6]/20 mb-6">
                    <LucideIcons.Bell className="text-[#abd1c6]/60" size="xl" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#fffffe] mb-2">
                    {activeFilter === "unread" 
                      ? "Нет непрочитанных уведомлений" 
                      : activeFilter === "all"
                      ? "Нет уведомлений"
                      : `Нет уведомлений типа "${filters.find(f => f.type === activeFilter)?.label || activeFilter}"`
                    }
                  </h3>
                  <p className="text-sm sm:text-base text-[#abd1c6]/60">
                    {activeFilter === "unread" 
                      ? "Все уведомления прочитаны" 
                      : activeFilter === "all"
                      ? "Здесь будут появляться новые уведомления"
                      : "Попробуйте выбрать другой фильтр"
                    }
                  </p>
                </motion.div>
              ) : (
                /* Группированные уведомления */
                <div className="space-y-8 sm:space-y-10">
                  {groupedNotifications.map((group, groupIndex) => {
                    let startIndex = 0;
                    for (let i = 0; i < groupIndex; i++) {
                      startIndex += groupedNotifications[i].notifications.length;
                    }
                    
                    return (
                      <NotificationGroup
                        key={group.date}
                        date={group.date}
                        notifications={group.notifications}
                        lastViewedTimestamp={lastViewedTimestamp}
                        onNotificationClick={handleNotificationClick}
                        startIndex={startIndex}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
