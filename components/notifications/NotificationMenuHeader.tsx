// components/notifications/NotificationMenuHeader.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface NotificationMenuHeaderProps {
  notificationsCount: number;
  unreadCount: number;
}

export default function NotificationMenuHeader({
  notificationsCount,
  unreadCount,
}: NotificationMenuHeaderProps) {
  const getNotificationCountText = (count: number) => {
    if (count === 1) return "уведомление";
    if (count < 5) return "уведомления";
    return "уведомлений";
  };

  return (
    <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-[#abd1c6]/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#f9bc60]/20 flex items-center justify-center border border-[#f9bc60]/30">
            <LucideIcons.Bell className="text-[#f9bc60] w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-[#fffffe] leading-tight">
              Уведомления
            </h3>
            {notificationsCount > 0 && (
              <p className="text-[10px] sm:text-[11px] text-[#abd1c6]/60 mt-0.5">
                {notificationsCount}{" "}
                {getNotificationCountText(notificationsCount)}
              </p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="min-w-[18px] h-5 sm:min-w-[20px] sm:h-5 bg-red-500 text-white text-[10px] sm:text-[11px] font-semibold rounded-full flex items-center justify-center px-1.5 shadow-sm"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </motion.span>
        )}
      </div>
    </div>
  );
}
