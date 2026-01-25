// components/notifications/NotificationsSection.tsx
"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Notification } from "./types";
import NotificationsList from "./NotificationsList";
import NotificationsLoading from "./NotificationsLoading";
import NotificationsEmpty from "./NotificationsEmpty";

interface NotificationsSectionProps {
  notifications: Notification[];
  loading: boolean;
  lastViewedTimestamp: string | null;
  scrollToOnMount?: boolean;
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationsSection({
  notifications,
  loading,
  lastViewedTimestamp,
  scrollToOnMount = false,
  onNotificationClick,
}: NotificationsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollToOnMount && sectionRef.current) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [scrollToOnMount]);

  const getNotificationCountText = (count: number) => {
    if (count === 1) return "уведомление";
    if (count < 5) return "уведомления";
    return "уведомлений";
  };

  return (
    <motion.section
      ref={sectionRef}
      id="notifications"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#001e1d]/60 to-[#004643]/40 backdrop-blur-xl shadow-xl overflow-hidden"
    >
      {/* Заголовок секции */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-[#abd1c6]/20 bg-[#001e1d]/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f9bc60]/20 flex items-center justify-center border border-[#f9bc60]/30">
              <LucideIcons.Bell className="text-[#f9bc60] w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#fffffe]">
                Уведомления
              </h2>
              {notifications.length > 0 && (
                <p className="text-xs sm:text-sm text-[#abd1c6]/60 mt-0.5">
                  {notifications.length}{" "}
                  {getNotificationCountText(notifications.length)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Список уведомлений */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {loading ? (
          <NotificationsLoading variant="feed" />
        ) : notifications.length === 0 ? (
          <NotificationsEmpty variant="feed" />
        ) : (
          <NotificationsList
            notifications={notifications}
            lastViewedTimestamp={lastViewedTimestamp}
            variant="feed"
            onNotificationClick={onNotificationClick}
          />
        )}
      </div>
    </motion.section>
  );
}
