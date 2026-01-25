// components/notifications/NotificationBellButton.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface NotificationBellButtonProps {
  isOpen: boolean;
  unreadCount: number;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export default function NotificationBellButton({
  isOpen,
  unreadCount,
  onClick,
  buttonRef,
}: NotificationBellButtonProps) {
  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-2 sm:p-2.5 rounded-xl text-[#fffffe] hover:bg-[#abd1c6]/10 transition-all duration-200 border ${
        isOpen
          ? "border-[#f9bc60]/50 bg-[#abd1c6]/10"
          : "border-[#abd1c6]/20 hover:border-[#abd1c6]/40"
      }`}
      aria-label={`Уведомления${unreadCount > 0 ? ` (${unreadCount} новых)` : ""}`}
    >
      <LucideIcons.Bell size="md" className={isOpen ? "text-[#f9bc60]" : ""} />

      {/* Индикатор непрочитанных уведомлений */}
      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 min-w-[20px] h-5 sm:min-w-[22px] sm:h-6 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-lg border-2 border-[#004643]"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </motion.div>
      )}
    </motion.button>
  );
}
