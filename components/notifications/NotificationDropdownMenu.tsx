// components/notifications/NotificationDropdownMenu.tsx
"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Notification } from "./types";
import NotificationMenuContent from "./NotificationMenuContent";

interface NotificationDropdownMenuProps {
  isOpen: boolean;
  mounted: boolean;
  menuPosition: { top: number; right: number };
  notifications: Notification[];
  loading: boolean;
  lastViewedTimestamp: string | null;
  unreadCount: number;
  onNotificationClick: (notification: Notification) => void;
  onShowAll: () => void;
}

export default function NotificationDropdownMenu({
  isOpen,
  mounted,
  menuPosition,
  notifications,
  loading,
  lastViewedTimestamp,
  unreadCount,
  onNotificationClick,
  onShowAll,
}: NotificationDropdownMenuProps) {
  if (!isOpen) return null;

  const menuContent = (
    <NotificationMenuContent
      notifications={notifications}
      loading={loading}
      lastViewedTimestamp={lastViewedTimestamp}
      unreadCount={unreadCount}
      onNotificationClick={onNotificationClick}
      onShowAll={onShowAll}
    />
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Мобильная версия через Portal */}
          {mounted && createPortal(
            <motion.div
              data-notification-menu
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed sm:hidden z-[99999] left-2 right-2 bg-gradient-to-br from-[#004643] via-[#003d3a] to-[#001e1d] rounded-2xl shadow-2xl border border-[#abd1c6]/30 overflow-hidden backdrop-blur-xl"
              style={{
                top: `${menuPosition.top}px`,
                maxHeight: typeof window !== 'undefined' 
                  ? `${Math.min(window.innerHeight - menuPosition.top - 16, window.innerHeight - 16)}px`
                  : 'calc(100vh - 5rem)',
                position: 'fixed',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {menuContent}
            </motion.div>,
            document.body
          )}
          
          {/* Планшетная и десктопная версия */}
          <motion.div
            data-notification-menu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[320px] sm:w-80 md:w-96 max-h-[85vh] sm:max-h-[500px] bg-gradient-to-br from-[#004643] via-[#003d3a] to-[#001e1d] rounded-2xl shadow-2xl border border-[#abd1c6]/30 overflow-hidden z-50 hidden sm:flex sm:flex-col backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {menuContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


