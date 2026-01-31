/**
 * Единая утилита для отображения статуса пользователя (онлайн/офлайн) по lastSeen.
 * Используется в профиле, друзьях, списках пользователей.
 */
export type UserStatusResult = {
  status: "online" | "offline";
  text: string;
};

export function getUserStatus(lastSeen: string | null): UserStatusResult {
  if (!lastSeen) {
    return { status: "offline", text: "Никогда не был в сети" };
  }

  const date = new Date(lastSeen);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return { status: "offline", text: "Никогда не был в сети" };
  }

  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 0 || diffInMinutes < 5) {
    return { status: "online", text: "Онлайн" };
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 1) {
    return { status: "offline", text: `${diffInMinutes}м назад` };
  }
  if (diffInHours < 24) {
    return { status: "offline", text: `${diffInHours}ч назад` };
  }
  if (diffInHours < 48) {
    return { status: "offline", text: "Вчера" };
  }
  return {
    status: "offline",
    text: date.toLocaleDateString("ru-RU"),
  };
}
