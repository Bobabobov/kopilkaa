// components/feed/NotificationCard.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Notification } from "@/components/notifications/types";
import {
  getNotificationIcon,
  isNotificationUnread,
} from "@/components/notifications/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
  index: number;
  lastViewedTimestamp: string | null;
  onClick: (notification: Notification) => void;
}

// Утилиты для визуального оформления
const getNotificationAccent = (
  type: string,
  status?: string,
  rarity?: string,
  isRead?: boolean,
) => {
  const opacity = isRead ? "20" : "40";

  if (type === "like") {
    return `bg-gradient-to-r from-red-500/${opacity} to-pink-500/${opacity}`;
  }
  if (type === "friend_request") {
    return `bg-gradient-to-r from-[#f9bc60]/${opacity} to-[#e16162]/${opacity}`;
  }
  if (type === "application_status") {
    if (status === "APPROVED") {
      return `bg-gradient-to-r from-green-500/${opacity} to-emerald-500/${opacity}`;
    }
    if (status === "REJECTED") {
      return `bg-gradient-to-r from-red-500/${opacity} to-rose-500/${opacity}`;
    }
    if (status === "CONTEST") {
      return `bg-gradient-to-r from-violet-500/${opacity} to-purple-500/${opacity}`;
    }
    return `bg-gradient-to-r from-blue-500/${opacity} to-indigo-500/${opacity}`;
  }
  return `bg-gradient-to-r from-[#abd1c6]/${opacity} to-[#004643]/${opacity}`;
};

// Извлекаем имя пользователя из message для лайков
const extractUserNameFromMessage = (message: string): string | null => {
  const match = message.match(/^([^"]+)\s+лайкнул/);
  return match ? match[1].trim() : null;
};

// Извлекаем название истории из message
const extractStoryTitleFromMessage = (message: string): string | null => {
  const match = message.match(/"([^"]+)"/);
  return match ? match[1] : null;
};

const TYPE_LABELS: Record<string, string> = {
  like: "Лайк",
  friend_request: "Друзья",
  application_status: "Заявка",
  system: "Система",
};

export default function NotificationCard({
  notification,
  index,
  lastViewedTimestamp,
  onClick,
}: NotificationCardProps) {
  const isUnread = isNotificationUnread(notification, lastViewedTimestamp);
  const userName =
    notification.type === "like"
      ? extractUserNameFromMessage(notification.message)
      : notification.type === "friend_request"
        ? notification.message.split(" хочет")[0]
        : null;
  const storyTitle =
    notification.type === "like" || notification.type === "application_status"
      ? extractStoryTitleFromMessage(notification.message)
      : null;

  const typeLabel = TYPE_LABELS[notification.type] ?? notification.type;

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.15 + index * 0.05, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Card
        variant="default"
        padding="none"
        hoverable
        onClick={() => onClick(notification)}
        className={cn(
          "relative overflow-hidden cursor-pointer h-full min-h-[200px] sm:min-h-[220px] transition-all duration-300",
          isUnread
            ? "ring-1 ring-[#f9bc60]/30 shadow-lg shadow-[#f9bc60]/5"
            : "opacity-90 hover:opacity-100",
        )}
      >
        {/* Визуальный акцент слева */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 rounded-l-xl",
            getNotificationAccent(
              notification.type,
              notification.status,
              notification.rarity,
              !isUnread,
            ),
            isUnread && "shadow-[0_0_12px_rgba(249,188,96,0.25)]",
          )}
        />

        <CardContent className="p-4 sm:p-5 lg:p-6 h-full flex flex-col">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            {/* Аватар или иконка */}
            <div className="flex-shrink-0">
              {notification.avatar &&
              (notification.type === "like" ||
                notification.type === "friend_request") ? (
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#abd1c6]/30 shadow-lg">
                  <img
                    src={notification.avatar}
                    alt={userName || "Пользователь"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== "/default-avatar.png") {
                        target.src = "/default-avatar.png";
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16
                    rounded-xl sm:rounded-2xl
                    bg-gradient-to-br from-[#004643]/60 to-[#001e1d]/80
                    border border-[#abd1c6]/20
                    flex items-center justify-center
                    shadow-lg
                    transition-all duration-300
                    group-hover:scale-110
                    group-hover:border-[#abd1c6]/40
                    ${isUnread ? "ring-2 ring-[#f9bc60]/20" : ""}
                  `}
                >
                  {getNotificationIcon(
                    notification.type,
                    notification.rarity,
                    notification.status,
                  )}
                </div>
              )}
            </div>

            {/* Текстовая информация */}
            <div className="flex-1 min-w-0 space-y-2 flex flex-col">
              {/* Тип, заголовок и время */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] font-medium px-2 py-0 rounded-md",
                    notification.type === "like" && "bg-red-500/15 text-red-400 border-red-500/30",
                    notification.type === "friend_request" && "bg-[#f9bc60]/15 text-[#f9bc60] border-[#f9bc60]/30",
                    notification.type === "application_status" &&
                      (notification.status === "APPROVED"
                        ? "bg-green-500/15 text-green-400 border-green-500/30"
                        : "bg-red-500/15 text-red-400 border-red-500/30"),
                  )}
                >
                  {typeLabel}
                </Badge>
                <span className="text-xs text-[#abd1c6]/50 ml-auto whitespace-nowrap">
                  {notification.timestamp}
                </span>
              </div>
              <h3
                className={cn(
                  "text-base sm:text-lg font-semibold text-[#fffffe] leading-tight",
                  isUnread && "font-bold",
                )}
              >
                {notification.title}
              </h3>

              {/* Подробная информация в зависимости от типа */}
              <div className="space-y-2 flex-1">
                {/* Лайки */}
                {notification.type === "like" && (
                  <>
                    <p className="text-sm sm:text-base text-[#abd1c6]/70 leading-relaxed">
                      {userName && (
                        <span className="font-medium text-[#abd1c6]/90">
                          {userName}
                        </span>
                      )}
                      {userName && " поставил(а) лайк вашей истории"}
                      {!userName && notification.message}
                    </p>
                    {storyTitle && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[#004643]/40 border border-[#abd1c6]/20">
                        <LucideIcons.FileText className="w-4 h-4 text-[#abd1c6]/60 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#abd1c6]/70 truncate">
                          {storyTitle}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Заявки */}
                {notification.type === "application_status" && (
                  <>
                    <p className="text-sm sm:text-base text-[#abd1c6]/70 leading-relaxed">
                      {notification.status === "APPROVED" ? (
                        <>
                          Ваша заявка была{" "}
                          <span className="font-medium text-green-400">
                            одобрена
                          </span>
                        </>
                      ) : (
                        <>
                          Ваша заявка была{" "}
                          <span className="font-medium text-red-400">
                            отклонена
                          </span>
                        </>
                      )}
                    </p>
                    {storyTitle && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-[#004643]/40 border border-[#abd1c6]/20">
                        <LucideIcons.FileText className="w-4 h-4 text-[#abd1c6]/60 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-[#abd1c6]/70 truncate">
                          {storyTitle}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* Заявки в друзья */}
                {notification.type === "friend_request" && (
                  <p className="text-sm sm:text-base text-[#abd1c6]/70 leading-relaxed">
                    {userName && (
                      <span className="font-medium text-[#abd1c6]/90">
                        {userName}
                      </span>
                    )}
                    {userName
                      ? " хочет добавить вас в друзья"
                      : notification.message}
                  </p>
                )}

                {/* Системные */}
                {notification.type === "system" && (
                  <p className="text-sm sm:text-base text-[#abd1c6]/70 leading-relaxed">
                    {notification.message}
                  </p>
                )}
              </div>

              {/* Новое + призыв к действию */}
              <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                {isUnread && (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#f9bc60]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f9bc60]" />
                    Новое
                  </motion.span>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-[#abd1c6]/60 group-hover:text-[#abd1c6]/90 transition-colors ml-auto">
                  Открыть
                  <LucideIcons.ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
