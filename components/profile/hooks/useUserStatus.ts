import { useMemo } from "react";

export type UserStatus =
  | { status: "online"; text: string }
  | { status: "offline"; text: string };

function calcStatus(lastSeen: string | null): UserStatus {
  if (!lastSeen) {
    return { status: "offline", text: "Никогда не был в сети" };
  }

  const date = new Date(lastSeen);
  const diffMinutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));

  if (diffMinutes <= 5) return { status: "online", text: "Онлайн" };
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 1)
    return { status: "offline", text: `${diffMinutes}м назад` };
  if (diffHours < 24) return { status: "offline", text: `${diffHours}ч назад` };
  if (diffHours < 48) return { status: "offline", text: "Вчера" };

  return { status: "offline", text: date.toLocaleDateString("ru-RU") };
}

/**
 * Возвращает статус пользователя по lastSeen и мемоизирует расчёт.
 */
export function useUserStatus(lastSeen: string | null): UserStatus {
  return useMemo(() => calcStatus(lastSeen), [lastSeen]);
}

/**
 * Утилита без React-хука — для мест без React lifecycle.
 */
export function getUserStatus(lastSeen: string | null): UserStatus {
  return calcStatus(lastSeen);
}
