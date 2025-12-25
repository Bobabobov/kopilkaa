// components/notifications/NotificationMenuContent.tsx
"use client";

import { Notification } from "./types";
import NotificationMenuHeader from "./NotificationMenuHeader";
import NotificationMenuFooter from "./NotificationMenuFooter";
import NotificationsList from "./NotificationsList";
import NotificationsLoading from "./NotificationsLoading";
import NotificationsEmpty from "./NotificationsEmpty";

interface NotificationMenuContentProps {
  notifications: Notification[];
  loading: boolean;
  lastViewedTimestamp: string | null;
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onShowAll: () => void;
}

export default function NotificationMenuContent({
  notifications,
  loading,
  lastViewedTimestamp,
  unreadCount,
  onNotificationClick,
  onShowAll,
}: NotificationMenuContentProps) {
  return (
    <>
      {/* Заголовок */}
      <NotificationMenuHeader
        notificationsCount={notifications.length}
        unreadCount={unreadCount}
      />

      {/* Список уведомлений */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain touch-pan-y min-h-0" 
        style={{ 
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
        onWheel={(e) => {
          e.stopPropagation();
        }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}
      >
        {loading ? (
          <NotificationsLoading variant="dropdown" />
        ) : notifications.length === 0 ? (
          <NotificationsEmpty variant="dropdown" />
        ) : (
          <NotificationsList
            notifications={notifications}
            lastViewedTimestamp={lastViewedTimestamp}
            variant="dropdown"
            onNotificationClick={onNotificationClick}
          />
        )}
      </div>

      {/* Футер */}
      {notifications.length > 0 && (
        <NotificationMenuFooter onShowAll={onShowAll} />
      )}
    </>
  );
}


