// components/notifications/NotificationsList.tsx
"use client";

import { Notification } from "./types";
import NotificationItem from "./NotificationItem";

interface NotificationsListProps {
  notifications: Notification[];
  lastViewedTimestamp: string | null;
  variant?: "dropdown" | "feed";
  onNotificationClick?: (notification: Notification) => void;
}

export default function NotificationsList({
  notifications,
  lastViewedTimestamp,
  variant = "feed",
  onNotificationClick,
}: NotificationsListProps) {
  return (
    <div className="divide-y divide-[#abd1c6]/10">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          lastViewedTimestamp={lastViewedTimestamp}
          variant={variant}
          onClick={onNotificationClick ? () => onNotificationClick(notification) : undefined}
        />
      ))}
    </div>
  );
}


