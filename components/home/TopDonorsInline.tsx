"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import Image from "next/image";

interface Donor {
  id: string;
  name: string;
  amount: string;
  avatar?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  heroBadge?: HeroBadgeType | null;
  position?: number;
}

/**
 * Блок «Топ‑донатёры» в стиле секции «Истории успеха».
 * Показывается между статистикой и блоком «Как это работает».
 */
export default function TopDonorsInline() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Error fetching top donors (inline):", error);
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

  const top1 = donors[0];
  const top2 = donors[1];
  const top3 = donors[2];

  const totalAmount = donors.reduce((sum, donor) => {
    const numeric = parseInt(donor.amount.replace(/\D/g, ""), 10);
    if (Number.isNaN(numeric)) return sum;
    return sum + numeric;
  }, 0);

  const formattedTotal =
    totalAmount > 0
      ? totalAmount.toLocaleString("ru-RU")
      : null;

  return (
    <section className="pt-10 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок секции */}
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#fffffe" }}
          >
            Топ-донатеры
          </h2>
          <p className="text-xl" style={{ color: "#abd1c6" }}>
            Люди, которые уже поддержали эксперимент
          </p>
          {formattedTotal && (
            <p className="mt-2 text-sm" style={{ color: "#abd1c6" }}>
              В сумме они уже собрали{" "}
              <span className="font-semibold text-[#f9bc60]">
                ₽{formattedTotal}
              </span>
            </p>
          )}
        </div>

        {/* Короткая строка с именами первых мест */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-[12px]" style={{ color: "#abd1c6" }}>
          {top1 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#001e1d]/80 px-3 py-1 border border-[#f9bc60]/60 text-[#f9bc60]">
              <span className="text-[11px] font-semibold">1 место:</span>
              <span className="font-semibold">{top1.name}</span>
            </span>
          )}
          {top2 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#001e1d]/80 px-3 py-1 border border-[#abd1c6]/60 text-[#abd1c6]">
              <span className="text-[11px] font-semibold">2 место:</span>
              <span className="font-semibold">{top2.name}</span>
            </span>
          )}
          {top3 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#001e1d]/80 px-3 py-1 border border-[#e16162]/60 text-[#e16162]">
              <span className="text-[11px] font-semibold">3 место:</span>
              <span className="font-semibold">{top3.name}</span>
            </span>
          )}
        </div>

        {/* Сетка донатёров в стиле карточек, как «Истории успеха», но с более
            аккуратным, «виджетным» оформлением и акцентом на 1–3 места */}
        <div className="relative">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {donors.map((donor, index) => {
            const numericAmount = parseInt(donor.amount.replace(/\D/g, ""), 10);
            const formattedAmount = Number.isNaN(numericAmount)
              ? donor.amount
              : numericAmount.toLocaleString("ru-RU");

            const place = donor.position || index + 1;
            const placeLabel =
              place === 1 ? "Главный герой" : `${place}-е место`;

            // Разные акценты для 1, 2 и 3 места
            const cardBorder =
              place === 1
                ? "border-[#f9bc60]/80"
                : place === 2
                ? "border-[#abd1c6]/70"
                : place === 3
                ? "border-[#e16162]/70"
                : "border-[#abd1c6]/25";

            const badgeBg =
              place === 1
                ? "bg-[#f9bc60] text-[#001e1d]"
                : place === 2
                ? "bg-[#abd1c6] text-[#001e1d]"
                : place === 3
                ? "bg-[#e16162] text-white"
                : "bg-[#94a1b2] text-[#001e1d]";

            return (
              <Link
                key={donor.id}
                href={`/profile/${donor.id}`}
                className="block h-full"
              >
                <div
                  className={`rounded-2xl overflow-hidden border ${cardBorder} bg-[#001e1d]/90 shadow-lg shadow-black/35 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full`}
                >
                <div className="p-6 flex flex-col h-full">
                  {/* Верхняя часть: место + имя + аватар */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center ${
                          place === 1
                            ? "bg-gradient-to-br from-[#f9bc60] via-[#f97316] to-[#e16162] p-[2px]"
                            : "bg-[#004643]"
                        }`}
                      >
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#004643]">
                        <Image
                          src={donor.avatar || "/default-avatar.png"}
                          alt={donor.name}
                          fill
                          sizes="48px"
                          quality={70}
                          className="object-cover"
                        />
                      </div>
                      </div>
                      {place === 1 && (
                        <div className="absolute -top-2 -left-1 flex items-center gap-1 rounded-full bg-[#f9bc60] px-2 py-0.5 text-[10px] font-semibold text-[#001e1d] shadow-md shadow-[#f9bc60]/60">
                          <LucideIcons.Crown size="xs" />
                          <span>Легенда</span>
                        </div>
                      )}
                      <div
                        className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-[#001e1d]/80 text-[11px] font-semibold shadow-sm ${badgeBg}`}
                      >
                        {place}
                      </div>
                    </div>
                    <div className="min-w-0 text-left">
                      <p
                        className="text-lg font-semibold truncate"
                        style={{ color: "#fffffe" }}
                      >
                        {donor.name}
                      </p>
                      <p className="text-[11px] font-medium" style={{ color: "#f9bc60" }}>
                        {placeLabel}
                      </p>
                      {donor.heroBadge && (
                        <div className="mt-2">
                          <HeroBadge badge={donor.heroBadge} size="xs" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Сумма */}
                  <div className="mb-4 text-left">
                    <span className="text-2xl font-bold">
                      <span style={{ color: "#f9bc60" }}>{formattedAmount}</span>
                      <span
                        style={{ color: "#ffffff", fontWeight: 900 }}
                      >{` руб`}</span>
                    </span>
                  </div>

                  {/* Соцсети донатера / сообщение, если их нет */}
                  {(donor.vkLink ||
                    donor.telegramLink ||
                    donor.youtubeLink) ? (
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-center gap-4">
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
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#4c75a3]/70 bg-transparent text-[#4c75a3] hover:bg-[#4c75a3]/20 transition-colors"
                          aria-label="VK"
                        >
                          <VKIcon className="h-4 w-4" />
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
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#229ED9]/70 bg-transparent text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors"
                          aria-label="Telegram"
                        >
                          <TelegramIcon className="h-4 w-4" />
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
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#ff4f45]/70 bg-transparent text-[#ff4f45] hover:bg-[#ff4f45]/20 transition-colors"
                          aria-label="YouTube"
                        >
                          <YouTubeIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 border-t border-white/10 text-[12px] text-center" style={{ color: "#abd1c6" }}>
                      Человечек не привязал свои соц.сети
                    </div>
                  )}
                </div>
              </div>
              </Link>
            );
          })}
          </div>
        </div>

        {/* CTA-блок: стать героем + посмотреть всех */}
        <div className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
              color: "#001e1d",
            }}
          >
            <LucideIcons.Heart size="sm" />
            Стать героем
          </Link>
          <Link
            href="/heroes"
            className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold rounded-xl border-2 transition-all duration-300 hover:scale-105"
            style={{
              borderColor: "#abd1c6",
              color: "#abd1c6",
            }}
          >
            Посмотреть всех героев
          </Link>
        </div>
      </div>
    </section>
  );
}



