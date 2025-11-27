"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import UniversalBackground from "@/components/ui/UniversalBackground";
import GamePreview from "@/components/games/GamePreview";

export default function GamesPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthorized(true);
          } else {
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <UniversalBackground />
        <div className="relative z-10 text-center">
          <div className="w-12 h-12 border-2 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#abd1c6]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Универсальный фон */}
      <UniversalBackground />

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg"
            >
              <span className="bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent">
            🎮 Игры
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg sm:text-xl text-[#abd1c6] mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Раздел игр сейчас в разработке. Мы готовим для вас мини‑игры, но пока
              запуск игр временно недоступен.
            </motion.p>

            {/* Предупреждение о разработке */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-2xl mx-auto mb-8 sm:mb-12"
            >
                      <div className="relative overflow-hidden bg-gradient-to-br from-[#f9bc60]/10 via-[#f9bc60]/5 to-[#abd1c6]/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#f9bc60]/30 hover:border-[#f9bc60]/50 transition-all duration-300 group">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f9bc60]/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-[#abd1c6]/10 rounded-full blur-lg group-hover:scale-110 transition-transform duration-500"></div>
                </div>
                <div className="relative z-10 flex items-start gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="text-2xl sm:text-3xl flex-shrink-0"
                  >
                    ⚠️
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-[#f9bc60] mb-2">
                      Раздел в разработке
                    </h3>
                    <p className="text-sm sm:text-base text-[#fffffe] leading-relaxed">
                      Раздел игр сейчас временно «заморожен». Мы переделываем игры и механику,
                      поэтому запуск недоступен. Как только всё будет готово — здесь появятся
                      новые активные игры.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Превью игр */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8 sm:mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto justify-center">
              <div className="md:col-start-1 md:col-end-2 lg:col-start-2 lg:col-end-3">
              <GamePreview
                title="Tower Blocks"
                description="3D игра на точность и реакцию. Сейчас игра временно недоступна — раздел в разработке."
                icon="🏗️"
                href="/tower-blocks"
                difficulty="Средне"
                category="Аркада"
                isAvailable={false}
              />
              </div>
            </div>
          </motion.div>

          {/* Кнопки действий */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12"
          >
            <Link
              href="/profile"
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-[#f9bc60] to-[#e8a545] hover:from-[#e8a545] hover:to-[#f9bc60] text-[#001e1d] font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
            >
              Вернуться в профиль
            </Link>
            <Link
              href="/applications"
              className="px-6 sm:px-8 py-3 bg-[#001e1d]/30 hover:bg-[#001e1d]/50 text-[#fffffe] font-semibold rounded-xl transition-all duration-300 border border-[#abd1c6]/20 hover:border-[#abd1c6]/40 shadow-lg hover:shadow-xl text-center"
            >
              Подать заявку
            </Link>
          </motion.div>

        {/* Дополнительная информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20 hover:shadow-3xl transition-all duration-500 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <div className="relative z-10 text-center">
              <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-bold text-[#fffffe] mb-2">
                Разнообразие игр
              </h3>
                <p className="text-sm text-[#abd1c6] leading-relaxed">
                Планируем добавить различные типы игр: головоломки, аркады,
                стратегии
              </p>
            </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20 hover:shadow-3xl transition-all duration-500 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <div className="relative z-10 text-center">
              <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-lg font-bold text-[#fffffe] mb-2">
                Система достижений
              </h3>
                <p className="text-sm text-[#abd1c6] leading-relaxed">
                Каждая игра будет интегрирована с системой достижений и
                рейтингов
              </p>
            </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden bg-gradient-to-br from-[#004643] via-[#004643] to-[#001e1d] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#abd1c6]/20 hover:shadow-3xl transition-all duration-500 group"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#f9bc60]/15 to-[#abd1c6]/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
              </div>
              <div className="relative z-10 text-center">
              <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-bold text-[#fffffe] mb-2">
                Быстрая разработка
              </h3>
                <p className="text-sm text-[#abd1c6] leading-relaxed">
                Мы активно работаем над играми и скоро представим первые
                результаты
              </p>
            </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
