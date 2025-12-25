// components/notifications/NotificationItem.tsx
"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Notification } from "./types";
import { 
  getNotificationIcon, 
  getRarityColor, 
  getRarityLabel,
  getNotificationBackgroundColor,
  isNotificationUnread
} from "./utils";

interface NotificationItemProps {
  notification: Notification;
  index: number;
  lastViewedTimestamp: string | null;
  variant?: "dropdown" | "feed";
  onClick?: () => void;
}

export default function NotificationItem({
  notification,
  index,
  lastViewedTimestamp,
  variant = "feed",
  onClick,
}: NotificationItemProps) {
  const router = useRouter();
  const isUnread = isNotificationUnread(notification, lastViewedTimestamp);

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

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

  const isDropdown = variant === "dropdown";
  const paddingClass = isDropdown 
    ? "px-2.5 py-2 sm:px-3 sm:py-2.5" 
    : "px-4 py-3 sm:px-6 sm:py-4";
  const avatarSize = isDropdown ? "w-8 h-8 sm:w-9 sm:h-9" : "w-10 h-10 sm:w-12 sm:h-12";
  const iconSize = isDropdown ? "w-4 h-4 sm:w-4.5 sm:h-4.5" : "w-5 h-5 sm:w-6 sm:h-6";
  const titleSize = isDropdown 
    ? "text-xs sm:text-sm" 
    : "text-sm sm:text-base";
  const messageSize = isDropdown 
    ? "text-[10px] sm:text-xs" 
    : "text-xs sm:text-sm";
  const borderClass = isUnread 
    ? (isDropdown ? 'border-l-2 border-l-[#f9bc60]' : 'border-l-4 border-l-[#f9bc60]')
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, x: isDropdown ? -5 : -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * (isDropdown ? 0.01 : 0.02), isDropdown ? 0.2 : 0.3) }}
      className={`relative ${paddingClass} ${isDropdown ? 'hover:bg-[#abd1c6]/5 active:bg-[#abd1c6]/8' : 'hover:bg-[#abd1c6]/5'} transition-colors ${isDropdown ? 'duration-150' : ''} cursor-pointer ${
        isUnread ? `bg-[#abd1c6]/3 ${borderClass}` : ''
      }`}
      onClick={handleClick}
    >
      {/* Индикатор непрочитанного для dropdown */}
      {isUnread && isDropdown && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1.5 sm:w-1.5 sm:h-2 rounded-full bg-[#f9bc60]" />
      )}
      
      <div className={`flex items-start ${isDropdown ? 'gap-2 sm:gap-2.5' : 'gap-3 sm:gap-4'}`}>
        {/* Аватар или иконка */}
        <div className={`${avatarSize} rounded-lg overflow-hidden bg-[#004643] flex items-center justify-center flex-shrink-0 border border-[#abd1c6]/20`}>
          {notification.avatar ? (
            <img
              src={notification.avatar}
              alt="Аватар"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/default-avatar.png') {
                  target.src = "/default-avatar.png";
                }
              }}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${getNotificationBackgroundColor(notification.type, notification.status)}`}>
              <div className={iconSize}>
                {getNotificationIcon(notification.type, notification.rarity, notification.status)}
              </div>
            </div>
          )}
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
            <h4 className={`font-medium text-[#fffffe] ${titleSize} break-words leading-tight ${
              isUnread ? 'font-semibold' : ''
            }`}>
              {notification.title}
            </h4>
            <span className={`text-[9px] sm:text-[10px] text-[#abd1c6]/50 flex-shrink-0 ${isDropdown ? 'ml-1.5' : ''} whitespace-nowrap`}>
              {notification.timestamp}
            </span>
          </div>
          <p className={`${messageSize} text-[#abd1c6]/80 ${isDropdown ? 'line-clamp-2' : 'line-clamp-2'} break-words leading-snug ${isDropdown ? '' : 'mb-2'}`}>
            {notification.message}
          </p>
          
          {/* Индикатор достижения */}
          {notification.type === "achievement" && notification.rarity && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`inline-flex items-center gap-1 ${isDropdown ? 'gap-1 mt-1 px-1.5 py-0.5 text-[9px] sm:text-[10px]' : 'gap-1.5 mt-2 px-2 py-1 text-xs'} rounded-full font-medium`}
              style={{
                backgroundColor: getRarityColor(notification.rarity) + '15',
                color: getRarityColor(notification.rarity),
              }}
            >
              <LucideIcons.Star className={isDropdown ? "w-2.5 h-2.5" : "w-3 h-3"} />
              {getRarityLabel(notification.rarity)}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

