"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAvatarFrame } from "@/lib/header-customization";

type Application = {
  id: string;
  title: string;
  summary: string;
  amount: number;
  payment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  userName: string;
  userId: string;
  userAvatar?: string | null;
  userAvatarFrame?: string | null;
  initial: string;
};

export default function RecentApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Загружаем последние заявки
    fetch("/api/applications/recent?limit=3")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.applications);
        } else {
          setError(data.error || "Не удалось загрузить заявки");
        }
      })
      .catch((err) => {
        console.error("Ошибка загрузки заявок:", err);
        setError("Ошибка соединения");
      })
      .finally(() => setLoading(false));
  }, []);

  // Предотвращаем hydration ошибки
  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Последние заявки
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-600/50 animate-pulse"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 день назад";
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} недели назад`;
    return `${Math.ceil(diffDays / 30)} месяца назад`;
  };

  // Функция для получения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-gray-900 dark:text-white";
      case "REJECTED":
        return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30";
      case "PENDING":
      default:
        return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30";
    }
  };

  // Функция для получения текста статуса
  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Одобрено";
      case "REJECTED":
        return "Отклонено";
      case "PENDING":
      default:
        return "На рассмотрении";
    }
  };

  // Функция для получения цвета карточки
  const getCardColor = (index: number) => {
    const colors = ["border-gray-200", "border-gray-300", "border-gray-400"];
    return colors[index % colors.length];
  };

  // Функция для получения цвета аватара
  const getAvatarColor = (index: number) => {
    const colors = ["bg-[#f9bc60]", "bg-[#abd1c6]", "bg-[#004643]"];
    return colors[index % colors.length];
  };

  return (
    <div
      className="max-w-6xl mx-auto mt-16 px-4 animate-fade-in-up"
      style={{ animationDelay: "900ms" }}
    >
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
        Последние заявки
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 border border-slate-200 dark:border-slate-600/50 animate-pulse"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-300 dark:bg-slate-600"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 dark:text-red-400 mb-4">⚠️ {error}</div>
          <p className="text-gray-600 dark:text-gray-400">
            Попробуйте обновить страницу
          </p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600 dark:text-gray-400 mb-4">
            📝 Пока нет заявок
          </div>
          <p className="text-gray-500 dark:text-gray-500">
            Станьте первым, кто подаст заявку!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <Link href={`/stories/${app.id}`} key={app.id}>
              <div
                className={`p-6 rounded-2xl bg-gradient-to-br ${getCardColor(index)} border hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden hover:scale-105 hover:-translate-y-3 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <Link
                    href={`/profile/${app.userId}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg overflow-hidden group-hover:scale-110 hover:rotate-12 transition-all duration-300 relative cursor-pointer`}
                    >
                      {(() => {
                        const frame = getAvatarFrame(
                          app.userAvatarFrame || "none",
                        );
                        const frameKey = app.userAvatarFrame || "none";

                        if (frame.type === "image") {
                          // Рамка-картинка
                          return (
                            <div className="w-full h-full rounded-lg overflow-hidden relative">
                              {/* Рамка как фон */}
                              <div
                                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-lg"
                                style={{
                                  backgroundImage: `url(${(frame as any).imageUrl || "/default-avatar.png"})`,
                                }}
                              />
                              {/* Аватар поверх рамки */}
                              <div className="absolute inset-1 rounded-md overflow-hidden">
                                {app.userAvatar ? (
                                  <img
                                    src={app.userAvatar}
                                    alt={app.userName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div
                                    className={`w-full h-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-lg relative overflow-hidden`}
                                  >
                                    {/* Градиентный фон для аватара */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <span className="relative z-10">
                                      {app.initial}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        } else {
                          // CSS рамка (only 'none' remains now)
                          return (
                            <div
                              className={`w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-lg ${frame.className} ${
                                app.userAvatar
                                  ? "bg-gray-100 dark:bg-gray-700"
                                  : getAvatarColor(index)
                              } relative overflow-hidden`}
                            >
                              {app.userAvatar ? (
                                <img
                                  src={app.userAvatar}
                                  alt={app.userName}
                                  className={`w-full h-full object-cover rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                                />
                              ) : (
                                <div
                                  className={`w-full h-full flex items-center justify-center rounded-lg ${frameKey === "rainbow" ? "rounded-lg" : ""}`}
                                >
                                  {/* Градиентный фон для аватара */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                  <span className="relative z-10">
                                    {app.initial}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </Link>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {app.title}
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                      {app.summary}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 relative z-10">
                  {/* Сумма запроса - главная информация */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1 relative hover:scale-110 transition-transform duration-300">
                      ₽{app.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Сумма запроса
                    </div>
                  </div>

                  {/* Статус с иконкой */}
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(app.status)} bg-opacity-10 hover:scale-105 transition-transform duration-200`}
                    >
                      {app.status === "APPROVED" && "✅ "}
                      {app.status === "REJECTED" && "❌ "}
                      {app.status === "PENDING" && "⏳ "}
                      {getStatusText(app.status)}
                    </div>
                  </div>

                  {/* Дата и время */}
                  <div className="text-center">
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      📅 {formatDate(app.createdAt)}
                    </div>
                  </div>

                  {/* Декоративная линия */}
                  <div
                    className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent animate-scale-x"
                    style={{ animationDelay: `${index * 100 + 500}ms` }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <Link
          href="/stories"
          className="btn-primary py-3 px-8 hover:scale-105 transition-all duration-300"
        >
          Посмотреть все заявки →
        </Link>
      </div>

      <style jsx>{`
        .animate-scale-x {
          animation: scale-x 0.8s ease-out forwards;
          transform: scaleX(0);
        }

        @keyframes scale-x {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}
