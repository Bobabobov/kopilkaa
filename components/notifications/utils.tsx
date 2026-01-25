// components/notifications/utils.tsx
"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { RARITY_NAMES, AchievementRarity } from "@/lib/achievements/types";

export function getNotificationIcon(
  type: string,
  rarity?: string,
  status?: string,
) {
  switch (type) {
    case "like":
      return <LucideIcons.Heart className="text-red-500" size="sm" />;
    case "achievement":
      return <LucideIcons.Star className="text-yellow-500" size="sm" />;
    case "friend_request":
      return <LucideIcons.UserPlus className="text-[#f9bc60]" size="sm" />;
    case "application_status":
      if (status === "APPROVED") {
        return <LucideIcons.CheckCircle className="text-[#10B981]" size="sm" />;
      } else if (status === "REJECTED") {
        return <LucideIcons.XCircle className="text-red-500" size="sm" />;
      }
      return <LucideIcons.FileText className="text-blue-500" size="sm" />;
    default:
      return <LucideIcons.Info className="text-blue-500" size="sm" />;
  }
}

export function getRarityColor(rarity?: string): string {
  switch (rarity) {
    case "COMMON":
      return "#94a1b2";
    case "RARE":
      return "#abd1c6";
    case "EPIC":
      return "#e16162";
    case "LEGENDARY":
      return "#f9bc60";
    case "EXCLUSIVE":
      return "#ff6b6b";
    default:
      return "#abd1c6";
  }
}

export function getRarityLabel(rarity?: string): string {
  if (!rarity) return "";
  return RARITY_NAMES[rarity as AchievementRarity] || rarity;
}

export function getNotificationBackgroundColor(
  type: string,
  status?: string,
): string {
  if (type === "application_status" && status === "APPROVED") {
    return "bg-[#10B981]/20";
  }
  if (type === "application_status" && status === "REJECTED") {
    return "bg-red-500/20";
  }
  if (type === "achievement") {
    return "bg-[#f9bc60]/20";
  }
  return "bg-[#abd1c6]/20";
}

export function isNotificationUnread(
  notification: { isRead?: boolean; createdAt: string },
  lastViewedTimestamp: string | null,
): boolean {
  // Если явно помечено как прочитанное - не прочитано
  if (notification.isRead === true) return false;

  // Если есть lastViewedTimestamp, используем его как основной критерий
  if (lastViewedTimestamp) {
    const notificationDate = new Date(notification.createdAt).getTime();
    const viewedDate = new Date(lastViewedTimestamp).getTime();
    // Если уведомление создано после последнего просмотра - оно непрочитанное
    return notificationDate > viewedDate;
  }

  // Если явно помечено как непрочитанное - непрочитанное
  if (notification.isRead === false) return true;

  // По умолчанию считаем непрочитанным, если нет информации
  return true;
}
