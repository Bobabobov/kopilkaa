// components/feed/NotificationCard.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Notification } from "@/components/notifications/types";
import {
  getNotificationIcon,
  getRarityColor,
  getRarityLabel,
  isNotificationUnread,
} from "@/components/notifications/utils";

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
  if (type === "achievement") {
    if (rarity === "EPIC") {
      return `bg-gradient-to-r from-purple-500/${opacity} to-pink-500/${opacity}`;
    }
    if (rarity === "RARE") {
      return `bg-gradient-to-r from-blue-500/${opacity} to-cyan-500/${opacity}`;
    }
    return `bg-gradient-to-r from-yellow-500/${opacity} to-orange-500/${opacity}`;
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

  return (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: 0.6 + index * 0.08,
        duration: 0.5,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className="group relative"
    >
      {/* Карточка уведомления */}
      <div
        onClick={() => onClick(notification)}
        className={`
          relative
          min-h-[200px] sm:min-h-[220px] lg:min-h-[240px]
          h-full
          rounded-2xl sm:rounded-3xl
          backdrop-blur-xl
          bg-gradient-to-br from-[#001e1d]/80 via-[#003c3a]/60 to-[#001e1d]/80
          border border-[#abd1c6]/20
          shadow-xl
          overflow-hidden
          transition-all duration-300
          cursor-pointer
          ${
            isUnread
              ? "opacity-100 shadow-2xl shadow-[#f9bc60]/10"
              : "opacity-75 hover:opacity-100"
          }
          hover:border-[#abd1c6]/40
          hover:shadow-2xl
        `}
      >
        {/* Визуальный акцент слева */}
        <div
          className={`
            absolute left-0 top-0 bottom-0 w-1.5 sm:w-2
            ${getNotificationAccent(
              notification.type,
              notification.status,
              notification.rarity,
              !isUnread,
            )}
            ${isUnread ? "shadow-lg shadow-[#f9bc60]/30" : ""}
          `}
        />

        {/* Glow эффект для непрочитанных */}
        {isUnread && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-[#f9bc60]/60 via-[#f9bc60]/40 to-transparent blur-sm" />
        )}

        {/* Контент карточки */}
        <div className="p-5 sm:p-6 lg:p-8 h-full flex flex-col">
          <div className="flex items-start gap-4 sm:gap-5 lg:gap-6 flex-1">
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
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 flex flex-col">
              {/* Заголовок и время */}
              <div className="flex items-start justify-between gap-3">
                <h3
                  className={`
                    text-base sm:text-lg lg:text-xl
                    font-semibold
                    text-[#fffffe]
                    leading-tight
                    ${isUnread ? "font-bold" : "font-medium"}
                  `}
                >
                  {notification.title}
                </h3>
                <span className="flex-shrink-0 text-xs sm:text-sm text-[#abd1c6]/50 whitespace-nowrap mt-0.5">
                  {notification.timestamp}
                </span>
              </div>

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

                {/* Достижения */}
                {notification.type === "achievement" && (
                  <>
                    <p className="text-sm sm:text-base text-[#abd1c6]/70 leading-relaxed">
                      {notification.message}
                    </p>
                    {notification.rarity && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.8 + index * 0.08 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                        style={{
                          backgroundColor:
                            getRarityColor(notification.rarity) + "20",
                          borderColor:
                            getRarityColor(notification.rarity) + "40",
                        }}
                      >
                        <span
                          style={{ color: getRarityColor(notification.rarity) }}
                        >
                          <LucideIcons.Star className="w-4 h-4" />
                        </span>
                        <span
                          className="text-xs sm:text-sm font-medium"
                          style={{ color: getRarityColor(notification.rarity) }}
                        >
                          {getRarityLabel(notification.rarity)}
                        </span>
                      </motion.div>
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

              {/* Индикатор непрочитанного */}
              {isUnread && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.08, type: "spring" }}
                  className="inline-flex items-center gap-2 mt-auto"
                >
                  <div className="w-2 h-2 rounded-full bg-[#f9bc60] shadow-lg shadow-[#f9bc60]/50" />
                  <span className="text-xs text-[#f9bc60]/80 font-medium">
                    Новое
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Декоративный градиент внизу карточки */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#abd1c6]/10 to-transparent" />
      </div>
    </motion.div>
  );
}
