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
    const lastSeenText = "";

    if (diffInHours < 1)
      return { status: "offline", text: `${diffInMinutes}м назад` };
    if (diffInHours < 24)
      return { status: "offline", text: `${diffInHours}ч назад` };
    if (diffInHours < 48) return { status: "offline", text: "Вчера" };
    return { status: "offline", text: date.toLocaleDateString("ru-RU") };
  };

  return (
    <div
      className={`relative overflow-hidden backdrop-blur-xl border-b border-[#abd1c6]/20 ${
        theme.background === "gradient"
          ? `bg-gradient-to-br ${(theme as any).gradient}`
          : "bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d]"
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


      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
            {/* Main user info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-[#fffffe]">
                Мой профиль
              </h1>


              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                <div className="flex items-center gap-3 text-sm text-[#abd1c6] opacity-90">
                  <div className="w-3 h-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] rounded-full"></div>
                  <span className="font-medium">
                    Участник с{" "}
                    <span className="text-[#f9bc60] font-semibold">
                      {new Date(user.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </span>
                </div>

                <div>
                  {(() => {
                    const status = getUserStatus(user.lastSeen || null);
                    return (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                        status.status === "online"
                          ? "bg-[#abd1c6]/20 border-[#abd1c6]/40"
                          : "bg-[#94a1b2]/10 border-[#94a1b2]/20"
                      }`}>
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            status.status === "online"
                              ? "bg-[#abd1c6] animate-pulse"
                              : "bg-[#94a1b2]"
                          }`}
                        ></div>
                        <span className={`text-sm font-semibold ${
                          status.status === "online"
                            ? "text-[#abd1c6]"
                            : "text-[#94a1b2]"
                        }`}>
                          {status.status === "online"
                            ? status.text
                            : `Последний вход: ${status.text}`}
                        </span>
                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
