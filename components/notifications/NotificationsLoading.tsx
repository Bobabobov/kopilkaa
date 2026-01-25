// components/notifications/NotificationsLoading.tsx
"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface NotificationsLoadingProps {
  variant?: "dropdown" | "feed";
}

export default function NotificationsLoading({
  variant = "feed",
}: NotificationsLoadingProps) {
  const isDropdown = variant === "dropdown";
  const paddingClass = isDropdown ? "p-4 sm:p-6" : "p-8";
  const iconSize = isDropdown ? "sm" : "md";

  return (
    <div className={`${paddingClass} text-center`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <LucideIcons.Loader2
          className={`text-[#f9bc60] mx-auto ${isDropdown ? "mb-2" : "mb-4"}`}
          size={iconSize}
        />
      </motion.div>
      <p
        className={`${isDropdown ? "text-xs sm:text-sm" : "text-sm"} text-[#abd1c6]`}
      >
        {isDropdown ? "Загрузка..." : "Загрузка уведомлений..."}
      </p>
    </div>
  );
}
