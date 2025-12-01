"use client";

import { useOnlineStatus } from "@/lib/useOnlineStatus";
import { getHeaderTheme } from "@/lib/header-customization";

interface User {
  id: string;
  email: string;
  name?: string | null;
  createdAt: string;
  headerTheme?: string | null;
  lastSeen?: string | null;
}

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const theme = getHeaderTheme(user.headerTheme || "default");
  useOnlineStatus(); // Автоматически обновляем статус

  // Определяем статус пользователя
  const getUserStatus = (lastSeen: string | null) => {
    if (!lastSeen) return { status: "offline", text: "Никогда не был в сети" };

    const date = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    // Если пользователь был активен в последние 5 минут - считаем онлайн
    if (diffInMinutes <= 5) {
      return { status: "online", text: "Онлайн" };
    }

    // Иначе показываем время последнего входа
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInHours < 1)
      return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24)
      return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString("ru-RU") };
  };

  const status = getUserStatus(user.lastSeen || null);
  const joinDate = new Date(user.createdAt).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
  });

  return (
    <div
      className={`relative overflow-hidden border-b border-[#abd1c6]/20 ${
        theme.background === "gradient"
          ? `bg-gradient-to-br ${(theme as any).gradient}`
          : "bg-[#004643]"
      }`}
      style={
        theme.background === "image"
          ? {
              backgroundImage: `url(${(theme as any).image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {}
      }
    >
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#fffffe] mb-2">
              {user.name || "Пользователь"}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-[#abd1c6]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#abd1c6]"></div>
                <span>Участник с {joinDate}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    status.status === "online"
                      ? "bg-[#abd1c6] animate-pulse"
                      : "bg-[#94a1b2]"
                  }`}
                ></div>
                <span>
                  {status.status === "online" ? status.text : `Был ${status.text}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
