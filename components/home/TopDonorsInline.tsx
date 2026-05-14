"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Heart, ArrowRight, Link2Off } from "lucide-react";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";

interface Donor {
  id: string;
  name: string;
  amount: string;
  avatar?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  position?: number;
}

/**
 * Блок «Топ‑донатёры» в стиле секции «Истории успеха».
 * Показывается между статистикой и блоком «Как это работает».
 */
export default function TopDonorsInline() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const fetchTopDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/top-donors", { cache: "no-store" });
        if (!response.ok) return;

        const data = await response.json();
        if (!data.success || !Array.isArray(data.donors)) return;

        // Берём только первых трёх донатёров
        setDonors((data.donors as Donor[]).slice(0, 3));
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Error fetching top donors (inline):", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopDonors();
  }, []);

  if (loading) {
    return (
      <section className="pt-6 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#2f7a67]/10 border-t-[#2f7a67]" />
            <p className="mt-4 text-sm" style={{ color: "#3f5a52" }}>
              Загружаем топ‑донатёров...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (donors.length === 0) {
    return null;
  }

  const totalAmount = donors.reduce((sum, donor) => {
    const numeric = parseInt(donor.amount.replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) return sum;
    return sum + numeric;
  }, 0);

  const formattedTotal =
    totalAmount > 0 ? totalAmount.toLocaleString("ru-RU") : null;

  return (
    <section className="pt-10 pb-20 px-4" id="top-donors">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
          >
            <Trophy className="w-4 h-4" />
            Наши герои
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{ color: "#fffffe" }}
          >
            Топ-донатеры
          </h2>
          <p className="text-lg md:text-xl mb-4" style={{ color: "#abd1c6" }}>
            Люди, которые уже поддержали проект
          </p>
          {formattedTotal && (
            <div
              className="inline-flex items-baseline gap-1.5 rounded-xl px-4 py-2"
              style={{ background: "rgba(249, 188, 96, 0.12)" }}
            >
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color: "#f9bc60" }}
              >
                ₽{formattedTotal}
              </span>
              <span className="text-sm" style={{ color: "#abd1c6" }}>
                собрали в сумме
              </span>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {donors.map((donor, index) => {
            const numericAmount = parseInt(donor.amount.replace(/\D/g, ""), 10);
            const formattedAmount = Number.isNaN(numericAmount)
              ? donor.amount
              : numericAmount.toLocaleString("ru-RU");

            const place = donor.position || index + 1;
            const placeLabel =
              place === 1 ? "Главный герой" : `${place}-е место`;

            const badgeBg =
              place === 1
                ? "bg-[#f9bc60] text-[#001e1d]"
                : place === 2
                  ? "bg-[#abd1c6] text-[#001e1d]"
                  : place === 3
                    ? "bg-[#e16162] text-white"
                    : "bg-[#94a1b2] text-[#001e1d]";

            return (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link
                  href={`/profile/${donor.id}`}
                  className="block h-full group"
                >
                  <div
                    className="h-full rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{
                      background:
                        "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      boxShadow:
                        "0 4px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-14 h-14 rounded-full overflow-hidden flex items-center justify-center ring-2 transition-all group-hover:ring-[#f9bc60]/50 ${
                            place === 1 ? "ring-[#f9bc60]/60" : "ring-white/10"
                          }`}
                        >
                          <img
                            src={
                              failedAvatars[donor.id]
                                ? DEFAULT_AVATAR
                                : resolveAvatarUrl(donor.avatar)
                            }
                            alt={donor.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={() =>
                              setFailedAvatars((prev) => ({
                                ...prev,
                                [donor.id]: true,
                              }))
                            }
                          />
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow ${badgeBg}`}
                        >
                          {place}
                        </div>
                        {place === 1 && (
                          <div className="absolute -top-1 -right-1 flex items-center gap-1 rounded-full bg-[#f9bc60] px-2 py-0.5 text-[10px] font-bold text-[#001e1d]">
                            <LucideIcons.Crown size="xs" />
                            <span>Легенда</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-lg font-bold truncate"
                          style={{ color: "#fffffe" }}
                        >
                          {donor.name}
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "#f9bc60" }}
                        >
                          {placeLabel}
                        </p>
                      </div>
                    </div>

                    <div
                      className="inline-flex items-baseline gap-1 rounded-xl px-3 py-1.5 mb-4"
                      style={{ background: "rgba(249, 188, 96, 0.12)" }}
                    >
                      <span
                        className="text-xl font-bold tabular-nums"
                        style={{ color: "#f9bc60" }}
                      >
                        {formattedAmount}
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: "#f9bc60" }}
                      >
                        руб
                      </span>
                    </div>

                    {donor.vkLink || donor.telegramLink || donor.youtubeLink ? (
                      <div className="pt-4 border-t border-white/10 flex items-center justify-center gap-3">
                        {donor.vkLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                donor.vkLink!,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4c75a3]/70 bg-transparent text-[#4c75a3] hover:bg-[#4c75a3]/20 transition-colors"
                            aria-label="VK"
                          >
                            <VKIcon className="h-4 w-4" />
                          </button>
                        )}
                        {donor.telegramLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                donor.telegramLink!,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#229ED9]/70 bg-transparent text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors"
                            aria-label="Telegram"
                          >
                            <TelegramIcon className="h-4 w-4" />
                          </button>
                        )}
                        {donor.youtubeLink && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.open(
                                donor.youtubeLink!,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#ff4f45]/70 bg-transparent text-[#ff4f45] hover:bg-[#ff4f45]/20 transition-colors"
                            aria-label="YouTube"
                          >
                            <YouTubeIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div
                        className="pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-xs"
                        style={{ color: "#94a1b2" }}
                      >
                        <Link2Off className="w-3.5 h-3.5" />
                        Соцсети не указаны
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
              color: "#001e1d",
              boxShadow: "0 8px 32px rgba(249, 188, 96, 0.25)",
            }}
          >
            <Heart className="w-5 h-5" />
            Стать героем
          </Link>
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.06]"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            Посмотреть всех героев
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
