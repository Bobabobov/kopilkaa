"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

interface Donor {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  amount: string;
  position: number;
  isTop: boolean;
  heroBadge?: HeroBadgeType | null;
}

export default function TopDonors() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/top-donors", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDonors(data.donors || []);
          }
        }
      } catch (error) {
        console.error("Error fetching top donors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  // Подсчёт общей суммы донатов в топе для отображения в блоке
  const totalAmount = donors.reduce((sum, donor) => {
    const numeric = parseInt(donor.amount.replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) return sum;
    return sum + numeric;
  }, 0);

  const formattedTotalAmount =
    totalAmount > 0
      ? new Intl.NumberFormat("ru-RU").format(totalAmount)
      : null;

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <LucideIcons.Crown size="sm" className="text-[#001e1d]" />;
      case 2:
        return <LucideIcons.Award size="sm" className="text-[#001e1d]" />;
      case 3:
        return <LucideIcons.Medal size="sm" className="text-[#001e1d]" />;
      default:
        return (
          <span className="text-xs font-bold text-[#001e1d]">{position}</span>
        );
    }
  };

  const getAvatarBg = (position: number) => {
    switch (position) {
      case 1:
        return "bg-[#f9bc60]";
      case 2:
        return "bg-[#abd1c6]";
      case 3:
        return "bg-[#e16162]";
      default:
        return "bg-[#94a1b2]";
    }
  };

  // Разделяем главного героя и остальных
  const topDonor = donors[0];
  const otherDonors = donors.slice(1, 3);

  return (
    <section className="w-full xl:order-4 order-4" style={{ maxWidth: 360 }}>
      <div
        className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/40 bg-gradient-to-br from-[#004643] via-[#002523] to-[#001e1d] px-6 py-6 shadow-2xl shadow-black/50"
        style={{ minHeight: 430 }}
      >
        {/* Декоративные круги на фоне */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f9bc60]/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-[#e16162]/15 blur-2xl" />

        {/* Верхняя панель */}
        <div className="relative mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f9bc60] text-lg text-[#001e1d] shadow-md shadow-[#f9bc60]/40">
              ★
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg sm:text-xl font-semibold text-[#fffffe]">
                Топ‑донатеры
              </h3>
              <p className="text-xs sm:text-sm text-[#abd1c6]/85">
                Герои, которые держат проект на плаву
              </p>
            </div>
          </div>
          <Link
            href="/support"
            className="inline-flex items-center gap-1 rounded-full bg-[#f9bc60] px-3 py-1 text-[10px] font-semibold text-[#001e1d] shadow-sm shadow-[#f9bc60]/40 hover:bg-[#e8a545] transition-colors"
          >
            <LucideIcons.Heart size="xs" />
            Поддержать
          </Link>
        </div>

        {/* Описание и ссылка на всех героев */}
        <div className="relative mb-4 flex items-center justify-between gap-3 text-[11px] text-[#abd1c6]/90">
          <div className="flex flex-col gap-0.5">
            <span>Каждый донат здесь превращается в развитие проекта.</span>
            {formattedTotalAmount && (
              <span className="text-[11px] font-semibold text-[#f9bc60]">
                Всего в топе: ₽{formattedTotalAmount}
              </span>
            )}
          </div>
          <Link
            href="/heroes"
            className="inline-flex items-center gap-1 rounded-full border border-[#abd1c6]/40 px-2 py-0.5 text-[10px] font-medium text-[#abd1c6] hover:bg-[#004643]/80 hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.Users size="xs" />
            Все герои
          </Link>
        </div>

        {/* Скелетон / Пусто / Контент */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-24 rounded-2xl bg-[#001e1d]/50 border border-[#abd1c6]/25 animate-pulse" />
            <div className="h-12 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20 animate-pulse" />
            <div className="h-12 rounded-xl bg-[#001e1d]/40 border border-[#abd1c6]/20 animate-pulse" />
          </div>
        ) : donors.length === 0 ? (
          <div className="relative mt-1 rounded-2xl border border-dashed border-[#abd1c6]/45 bg-[#001e1d]/70 px-4 py-4 text-[12px] text-[#abd1c6]">
            <p className="mb-2">
              Здесь появится главный герой проекта — человек, который поддержит нас
              больше всех. Возможно, это будете именно вы.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center justify-center gap-1 rounded-full bg-[#f9bc60] px-3 py-1 text-[11px] font-semibold text-[#001e1d] hover:bg-[#e8a545] transition-colors"
            >
              <LucideIcons.Heart size="xs" />
              Стать первым героем
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Главный герой */}
            {topDonor && (
              <Link href={`/profile/${topDonor.id}`}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative overflow-hidden rounded-2xl border border-[#f9bc60]/70 bg-gradient-to-r from-[#f9bc60]/15 via-[#001e1d]/90 to-[#001e1d]/95 px-4 py-4 cursor-pointer"
                >
                  <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#f9bc60]/20 blur-xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#f9bc60] shadow-md shadow-[#f9bc60]/40">
                        <img
                          src={topDonor.avatar || "/default-avatar.png"}
                          alt={topDonor.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/default-avatar.png";
                          }}
                        />
                      </div>
                      {getRankIcon(1)}
                      <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#001e1d] border border-[#f9bc60]/80 text-[10px] text-[#f9bc60] shadow-sm">
                        #1
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#f9bc60]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#f9bc60]">
                          Главный герой
                        </span>
                      </div>
                      <p className="truncate text-base sm:text-lg font-semibold text-[#fffffe]">
                        {topDonor.name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#f9bc60]">
                        Оплатил(а): ₽{topDonor.amount}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {/* VK */}
                        <button
                          type="button"
                          onClick={(event) => {
                            if (!topDonor.vkLink) return;
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                              topDonor.vkLink!,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full border bg-transparent transition-colors ${
                            topDonor.vkLink
                              ? "border-[#4c75a3]/60 text-[#4c75a3] hover:bg-[#4c75a3]/20"
                              : "border-[#4c75a3]/25 text-[#4c75a3]/40 cursor-default"
                          }`}
                          aria-label="VK"
                        >
                          <VKIcon className="h-3 w-3" />
                        </button>

                        {/* Telegram */}
                        <button
                          type="button"
                          onClick={(event) => {
                            if (!topDonor.telegramLink) return;
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                              topDonor.telegramLink!,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full border bg-transparent transition-colors ${
                            topDonor.telegramLink
                              ? "border-[#229ED9]/60 text-[#229ED9] hover:bg-[#229ED9]/20"
                              : "border-[#229ED9]/25 text-[#229ED9]/40 cursor-default"
                          }`}
                          aria-label="Telegram"
                        >
                          <TelegramIcon className="h-3 w-3" />
                        </button>

                        {/* YouTube */}
                        <button
                          type="button"
                          onClick={(event) => {
                            if (!topDonor.youtubeLink) return;
                            event.preventDefault();
                            event.stopPropagation();
                            window.open(
                              topDonor.youtubeLink!,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className={`inline-flex h-6 w-6 items-center justify-center rounded-full border bg-transparent transition-colors ${
                            topDonor.youtubeLink
                              ? "border-[#ff4f45]/60 text-[#ff4f45] hover:bg-[#ff4f45]/20"
                              : "border-[#ff4f45]/25 text-[#ff4f45]/40 cursor-default"
                          }`}
                          aria-label="YouTube"
                        >
                          <YouTubeIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Остальные места */}
            {otherDonors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#abd1c6]/85 px-1">
                  <span>Другие герои</span>
                  <span>места 2–3</span>
                </div>
                {otherDonors.map((donor) => {
                  const isSecond = donor.position === 2;
                  const isThird = donor.position === 3;

                  return (
                    <Link key={donor.id} href={`/profile/${donor.id}`}>
                      <motion.div
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`flex items-center justify-between gap-3 rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/75 hover:border-[#f9bc60]/60 hover:bg-[#004643]/80 transition-colors cursor-pointer ${
                          isSecond ? "px-4 py-3" : "px-3 py-2.5"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            <div
                              className={`overflow-hidden rounded-full border border-[#abd1c6]/40 ${
                                isSecond ? "h-11 w-11" : "h-10 w-10"
                              }`}
                            >
                              <img
                                src={donor.avatar || "/default-avatar.png"}
                                alt={donor.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/default-avatar.png";
                                }}
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#001e1d] border border-[#f9bc60]/80 text-[9px] text-[#f9bc60] shadow-sm">
                              #{donor.position}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`truncate font-semibold text-[#fffffe] ${
                                isSecond ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                              }`}
                            >
                              {donor.name}
                            </p>
                            {donor.heroBadge && (
                              <div className="mt-1">
                                <HeroBadge badge={donor.heroBadge} size="xs" />
                              </div>
                            )}
                            <p
                              className={`font-semibold text-[#f9bc60] ${
                                isSecond ? "text-sm" : "text-[11px]"
                              }`}
                            >
                              ₽{donor.amount}
                            </p>
                          </div>
                        </div>
                      {(donor.vkLink ||
                        donor.telegramLink ||
                        donor.youtubeLink) && (
                        <div className="flex items-center gap-1">
                          {donor.vkLink && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                window.open(
                                  donor.vkLink!,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#4c75a3]/60 bg-transparent text-[#4c75a3] hover:bg-[#4c75a3]/20 transition-colors"
                              aria-label="VK"
                            >
                              <VKIcon className="h-3 w-3" />
                            </button>
                          )}
                          {donor.telegramLink && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                window.open(
                                  donor.telegramLink!,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#229ED9]/60 bg-transparent text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors"
                              aria-label="Telegram"
                            >
                              <TelegramIcon className="h-3 w-3" />
                            </button>
                          )}
                          {donor.youtubeLink && (
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                window.open(
                                  donor.youtubeLink!,
                                  "_blank",
                                  "noopener,noreferrer",
                                );
                              }}
                              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#ff4f45]/60 bg-transparent text-[#ff4f45] hover:bg-[#ff4f45]/20 transition-colors"
                              aria-label="YouTube"
                            >
                              <YouTubeIcon className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </Link>
                );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}