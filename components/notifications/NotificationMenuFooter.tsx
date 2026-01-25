// components/notifications/NotificationMenuFooter.tsx
"use client";

import { motion } from "framer-motion";

interface NotificationMenuFooterProps {
  onShowAll: () => void;
}

export default function NotificationMenuFooter({
  onShowAll,
}: NotificationMenuFooterProps) {
  return (
    <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 border-t border-[#abd1c6]/20 bg-[#001e1d]/30">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={(e) => {
          e.stopPropagation();
          onShowAll();
        }}
        className="w-full text-[10px] sm:text-xs text-[#abd1c6] hover:text-[#fffffe] font-medium transition-colors text-center py-1.5 sm:py-2 rounded hover:bg-[#abd1c6]/8 active:bg-[#abd1c6]/12"
      >
        Показать все уведомления
      </motion.button>
    </div>
  );
}
