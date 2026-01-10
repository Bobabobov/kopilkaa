import { AnimatePresence, motion } from "framer-motion";
import type { UseSettingsReturn } from "../hooks/useSettings";

type LocalNotification = UseSettingsReturn["localNotification"];

interface SettingsLocalNotificationProps {
  notification: LocalNotification;
}

export function SettingsLocalNotification({ notification }: SettingsLocalNotificationProps) {
  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          key="local-notification"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`mx-4 sm:mx-6 mb-4 p-3 sm:p-4 rounded-xl shadow-lg border ${
            notification.type === "success"
              ? "bg-emerald-500/15 border-emerald-400/30"
              : notification.type === "error"
                ? "bg-red-500/15 border-red-400/30"
                : "bg-[#f9bc60]/15 border-[#f9bc60]/30"
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: notification.type === "error" ? "#e16162" : "#f9bc60" }}
            >
              <span className="text-white text-xs sm:text-sm">
                {notification.type === "success" ? "✓" : notification.type === "error" ? "✗" : "ℹ"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm sm:text-base break-words text-[#fffffe]">
                {notification.title}
              </div>
              <div className="text-xs sm:text-sm break-words text-[#abd1c6]">
                {notification.message}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
