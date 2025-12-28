// app/banned/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";

export default function BannedPage() {
  const router = useRouter();
  const [banInfo, setBanInfo] = useState<{
    reason: string | null;
    until: string | null;
    isPermanent: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBanStatus = async () => {
      try {
        const response = await fetch("/api/auth/check", { cache: "no-store" });
        const data = await response.json();

        if (!data.banned) {
          // Пользователь не заблокирован, перенаправляем на главную
          router.push("/");
          return;
        }

        setBanInfo(data.banInfo);
      } catch (error) {
        console.error("Error checking ban status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkBanStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <LucideIcons.Loader2 className="animate-spin text-[#abd1c6] text-4xl" />
        </div>
      </div>
    );
  }

  if (!banInfo) {
    return null;
  }

  const bannedUntil = banInfo.until ? new Date(banInfo.until) : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-gradient-to-br from-red-500/20 via-red-600/20 to-red-700/20 backdrop-blur-xl rounded-3xl border-2 border-red-500/50 shadow-2xl p-8 md:p-12">
            {/* Иконка */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center border-2 border-red-500/50">
                <LucideIcons.AlertTriangle className="w-10 h-10 text-red-400" />
              </div>
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-red-400 mb-4">
              Ваш аккаунт заблокирован
            </h1>

            {/* Причина */}
            {banInfo.reason && (
              <div className="mb-6 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                <p className="text-sm font-semibold text-red-300 mb-2">Причина блокировки:</p>
                <p className="text-base text-[#abd1c6]">{banInfo.reason}</p>
              </div>
            )}

            {/* Информация о сроке блокировки */}
            <div className="mb-8 text-center">
              {banInfo.isPermanent ? (
                <p className="text-lg text-[#abd1c6]">
                  Ваш аккаунт заблокирован <span className="font-semibold text-red-400">навсегда</span>.
                </p>
              ) : bannedUntil ? (
                <div className="space-y-2">
                  <p className="text-lg text-[#abd1c6]">
                    Ваш аккаунт заблокирован до:
                  </p>
                  <p className="text-2xl font-bold text-[#f9bc60]">
                    {bannedUntil.toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-lg text-[#f9bc60]">
                    {bannedUntil.toLocaleTimeString("ru-RU", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-[#abd1c6] mt-4">
                    После истечения срока блокировки доступ будет автоматически восстановлен.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Дополнительная информация */}
            <div className="bg-[#001e1d]/40 rounded-xl p-4 border border-[#abd1c6]/20">
              <p className="text-sm text-[#abd1c6] text-center">
                Если вы считаете, что блокировка была применена по ошибке, обратитесь к администратору.
              </p>
            </div>

            {/* Кнопка выхода */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch("/api/auth/logout", {
                      method: "POST",
                    });
                    if (response.ok) {
                      router.push("/");
                      router.refresh();
                    }
                  } catch (error) {
                    console.error("Error logging out:", error);
                  }
                }}
                className="px-6 py-3 bg-[#001e1d] hover:bg-[#002724] text-[#abd1c6] font-semibold rounded-xl border border-[#abd1c6]/30 hover:border-[#f9bc60]/50 transition-all duration-200 flex items-center gap-2"
              >
                <LucideIcons.Logout size="sm" />
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


