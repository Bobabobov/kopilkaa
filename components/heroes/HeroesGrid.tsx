// components/heroes/HeroesGrid.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import HeroesFilters from "./HeroesFilters";
import HeroesTopThree from "./HeroesTopThree";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatDateFull } from "@/lib/time";
import { formatRub } from "@/lib/format";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: string;
  hasExtendedPlacement?: boolean;
  isSubscriber?: boolean; // backward-compatible
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

interface HeroesGridProps {
  heroes: Hero[];
  topThree: Hero[];
  total: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: "total" | "count" | "date";
  onSortChange: (sort: "total" | "count" | "date") => void;
  hasMore: boolean;
  loadingMore: boolean;
  observerTargetRef: React.RefObject<HTMLDivElement | null>;
}

const DEFAULT_AVATAR = "/default-avatar.png";

export default function HeroesGrid({
  heroes,
  topThree,
  total,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  hasMore,
  loadingMore,
  observerTargetRef,
}: HeroesGridProps) {
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );
  const openExternal = (raw?: string | null) => {
    if (!raw) return;
    // API уже санитизирует, но на всякий — запретим javascript:
    const v = raw.trim();
    if (!/^https?:\/\//i.test(v) && !/^tg:\/\//i.test(v)) return;
    window.open(v, "_blank", "noopener,noreferrer");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return null;
    }
  };

  const getRankBorder = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700"; // Золотой
      case 2:
        return "#C0C0C0"; // Серебряный
      case 3:
        return "#CD7F32"; // Бронзовый
      default:
        return "rgba(171, 209, 198, 0.3)";
    }
  };

  return (
    <div>
      {/* Фильтры */}
      <HeroesFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />

      {/* Топ-3 */}
      <HeroesTopThree heroes={topThree} />

      {/* Заголовок с результатами */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 sm:mb-6 gap-2">
        <div>
          <div className="text-xs text-[#94a1b2]">Рейтинг</div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#fffffe]">
            Все профили
          </h3>
        </div>
        <div className="text-xs sm:text-sm md:text-base text-[#abd1c6]">
          Показано{" "}
          <span className="text-[#fffffe] font-semibold">{heroes.length}</span>{" "}
          из <span className="text-[#fffffe] font-semibold">{total}</span>
        </div>
      </div>

      {/* Сетка героев */}
      {heroes.length === 0 ? (
        <Card variant="darkGlass" padding="lg" className="text-center">
          <div className="mb-3 flex justify-center">
            <LucideIcons.Search className="w-10 h-10 text-[#abd1c6]" />
          </div>
          <div className="text-lg font-semibold text-[#fffffe]">Ничего не найдено</div>
          <div className="mt-2 text-sm text-[#abd1c6]">Попробуйте изменить запрос или сортировку.</div>
          {(searchTerm || sortBy !== "total") && (
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="px-4 py-2 rounded-xl border border-white/10 text-[#abd1c6] hover:border-[#f9bc60]/30 hover:text-[#f9bc60] transition-colors text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Очистить поиск
                </button>
              )}
              {sortBy !== "total" && (
                <button
                  type="button"
                  onClick={() => onSortChange("total")}
                  className="px-4 py-2 rounded-xl border border-white/10 text-[#abd1c6] hover:border-[#f9bc60]/30 transition-colors text-sm font-semibold"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  Сортировать по объёму поддержки
                </button>
              )}
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {heroes.map((hero) => {
            const hasSocialLinks =
              !!hero.vkLink || !!hero.telegramLink || !!hero.youtubeLink;

            return (
              <Link
                key={hero.id}
                href={`/profile/${hero.id}`}
                className="block focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 rounded-2xl"
              >
                <div className="group relative p-4 sm:p-5 rounded-2xl border border-white/[0.08] transition-all cursor-pointer hover:-translate-y-1 hover:border-[#f9bc60]/25 hover:shadow-lg hover:shadow-black/20" style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
                  {/* Accent glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full blur-3xl bg-[#f9bc60]/10" />
                    <div className="absolute -right-10 bottom-0 w-40 h-40 rounded-full blur-3xl bg-[#abd1c6]/10" />
                  </div>

                  {/* Ранг */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {getRankIcon(hero.rank) && (
                        <span className="text-xl sm:text-2xl flex-shrink-0">
                          {getRankIcon(hero.rank)}
                        </span>
                      )}
                      <span
                        className="text-base sm:text-lg font-bold whitespace-nowrap"
                        style={{
                          color:
                            hero.rank <= 3
                              ? getRankBorder(hero.rank)
                              : "#f9bc60",
                        }}
                      >
                        #{hero.rank}
                      </span>
                    </div>
                    {(hero.hasExtendedPlacement ?? hero.isSubscriber) && (
                      <span className="inline-flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 border border-[#f9bc60]/30 bg-[#f9bc60]/10 text-[#f9bc60]">
                        <LucideIcons.Star size="sm" />
                        Активный герой
                      </span>
                    )}
                  </div>

                  {/* Аватар и имя */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 min-w-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 flex-shrink-0">
                      <img
                        src={
                          failedAvatars[hero.id]
                            ? DEFAULT_AVATAR
                            : hero.avatar || DEFAULT_AVATAR
                        }
                        alt={hero.name}
                        className="w-full h-full object-cover"
                        onError={() =>
                          setFailedAvatars((prev) => ({
                            ...prev,
                            [hero.id]: true,
                          }))
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3
                        className="text-base sm:text-lg font-bold truncate"
                        style={{ color: "#fffffe" }}
                      >
                        {hero.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: "#abd1c6" }}
                      >
                        С {formatDateFull(hero.joinedAt)}
                      </p>
                    </div>
                    <div className="text-[#94a1b2] opacity-0 group-hover:opacity-100 transition-opacity">
                      <LucideIcons.ChevronRight size="sm" />
                    </div>
                  </div>
                  {/* Статистика */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="text-center p-2 sm:p-3 rounded-xl border border-white/10 bg-white/5">
                      <p className="text-lg sm:text-xl font-bold break-words text-[#fffffe]">
                        {formatRub(hero.totalDonated)}
                      </p>
                      <p className="text-xs sm:text-sm text-[#abd1c6]">
                        Общий вклад
                      </p>
                    </div>
                    <div className="text-center p-2 sm:p-3 rounded-xl border border-white/10 bg-white/5">
                      <p className="text-lg sm:text-xl font-bold text-[#fffffe]">
                        {hero.donationCount}
                      </p>
                      <p className="text-xs sm:text-sm text-[#abd1c6]">
                        Поддержки
                      </p>
                    </div>
                  </div>
                  {/* Соцсети: фиксированное место, чтобы все карточки были одной высоты */}
                  <div className="mt-3 sm:mt-4 min-h-[32px] sm:min-h-[36px] flex flex-wrap gap-1.5 sm:gap-2 items-center">
                    {!hasSocialLinks && (
                      <span className="text-xs text-[#94a1b2]" title="Пользователь не указал ссылки в профиле">
                        Соц. сети не привязаны
                      </span>
                    )}
                    {hasSocialLinks && hero.vkLink && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openExternal(hero.vkLink);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                      >
                        <VKIcon className="w-3.5 h-3.5" />
                        <span>VK</span>
                      </button>
                    )}
                    {hasSocialLinks && hero.telegramLink && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openExternal(hero.telegramLink);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                      >
                        <TelegramIcon className="w-3.5 h-3.5" />
                        <span>Telegram</span>
                      </button>
                    )}
                    {hasSocialLinks && hero.youtubeLink && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openExternal(hero.youtubeLink);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                      >
                        <YouTubeIcon className="w-3.5 h-3.5" />
                        <span>YouTube</span>
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Lazy load */}
      {loadingMore && (
        <div className="flex justify-center items-center py-10">
          <div className="w-10 h-10 border-2 border-white/20 border-t-[#f9bc60] rounded-full animate-spin" />
        </div>
      )}
      {hasMore && !loadingMore && (
        <div ref={observerTargetRef} className="h-16" />
      )}
    </div>
  );
}
