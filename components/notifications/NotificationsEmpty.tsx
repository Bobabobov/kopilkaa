// components/notifications/NotificationsEmpty.tsx
"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface NotificationsEmptyProps {
  variant?: "dropdown" | "feed";
}

export default function NotificationsEmpty({
  variant = "feed",
}: NotificationsEmptyProps) {
  const isDropdown = variant === "dropdown";
  const paddingClass = isDropdown ? "p-4 sm:p-6" : "p-8";
  const iconSize = isDropdown ? "w-6 h-6" : "w-8 h-8";
  const iconContainerSize = isDropdown
    ? "w-12 h-12 sm:w-14 sm:h-14"
    : "w-16 h-16";
  const titleSize = isDropdown ? "text-xs sm:text-sm" : "text-base";
  const messageSize = isDropdown ? "text-[10px] sm:text-xs" : "text-sm";

  return (
    <div className={`${paddingClass} text-center`}>
      <div
        className={`${iconContainerSize} mx-auto ${isDropdown ? "mb-3" : "mb-4"} rounded-full bg-[#abd1c6]/10 flex items-center justify-center border border-[#abd1c6]/20`}
      >
        <LucideIcons.Bell className={`text-[#abd1c6]/60 ${iconSize}`} />
      </div>
      <p
        className={`${titleSize} font-medium text-[#fffffe] ${isDropdown ? "mb-1" : "mb-2"}`}
      >
        Нет уведомлений
      </p>
      <p className={`${messageSize} text-[#abd1c6]/60`}>
        {isDropdown
          ? "Здесь будут появляться новые уведомления"
          : "Здесь будут появляться новые уведомления"}
      </p>
    </div>
  );
}
