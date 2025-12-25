// components/feed/NotificationGroup.tsx
"use client";

import { motion } from "framer-motion";
import { Notification } from "@/components/notifications/types";
import NotificationCard from "./NotificationCard";

interface NotificationGroupProps {
  date: string;
  notifications: Notification[];
  lastViewedTimestamp: string | null;
  onNotificationClick: (notification: Notification) => void;
  startIndex: number;
}

const formatGroupDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Сбрасываем время для сравнения
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Сегодня";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Вчера";
  } else {
    return date.toLocaleDateString("ru-RU", { 
      day: "numeric", 
      month: "long",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
    });
  }
};

export default function NotificationGroup({ 
  date, 
  notifications, 
  lastViewedTimestamp,
  onNotificationClick,
  startIndex 
}: NotificationGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 sm:mb-10"
    >
      {/* Заголовок группы */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent" />
        <h2 className="text-sm sm:text-base font-semibold text-[#abd1c6]/80 px-4 py-1.5 rounded-full bg-[#001e1d]/60 border border-[#abd1c6]/20">
          {formatGroupDate(date)}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#abd1c6]/30 to-transparent" />
      </div>

      {/* Карточки уведомлений */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {notifications.map((notification, index) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            index={startIndex + index}
            lastViewedTimestamp={lastViewedTimestamp}
            onClick={onNotificationClick}
          />
        ))}
      </div>
    </motion.div>
  );
}


