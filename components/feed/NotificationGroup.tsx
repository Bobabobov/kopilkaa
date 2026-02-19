// components/feed/NotificationGroup.tsx
"use client";

import { motion } from "framer-motion";
import { Notification } from "@/components/notifications/types";
import { formatDateGroup } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import NotificationCard from "./NotificationCard";

interface NotificationGroupProps {
  date: string;
  notifications: Notification[];
  lastViewedTimestamp: string | null;
  onNotificationClick: (notification: Notification) => void;
  startIndex: number;
}

export default function NotificationGroup({
  date,
  notifications,
  lastViewedTimestamp,
  onNotificationClick,
  startIndex,
}: NotificationGroupProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-labelledby={`group-${date}`}
      className="mb-8 sm:mb-10"
    >
      <Separator className="mb-5 bg-[#abd1c6]/15" />

      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <Badge
          variant="secondary"
          className="text-xs font-medium px-3 py-1 rounded-full border-[#abd1c6]/25"
        >
          {formatDateGroup(date)}
        </Badge>
        <span className="text-xs text-[#abd1c6]/50">
          {notifications.length}{" "}
          {notifications.length === 1 ? "уведомление" : "уведомлений"}
        </span>
      </div>

      <div
        id={`group-${date}`}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6"
      >
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
    </motion.section>
  );
}
