// components/heroes/HeroesGrid.tsx
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import HeroesFilters from "./HeroesFilters";
import HeroesTopThree from "./HeroesTopThree";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: Date;
  isSubscriber: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

interface HeroesGridProps {
  heroes: Hero[];
}

export default function HeroesGrid({ heroes }: HeroesGridProps) {
  const [sortBy, setSortBy] = useState<"total" | "count" | "date">("total");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedHeroes = useMemo(() => {
    let filtered = [...heroes];

    // Поиск по имени
    if (searchTerm) {
      filtered = filtered.filter(hero =>
        hero.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "total":
          return b.totalDonated - a.totalDonated;
        case "count":
          return b.donationCount - a.donationCount;
        case "date":
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [heroes, searchTerm, sortBy]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
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
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Топ-3 */}
      <HeroesTopThree heroes={heroes} />

      {/* Заголовок с результатами */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0 text-[#fffffe]">
          Все донатеры
        </h3>
        <div className="text-sm md:text-base text-[#abd1c6]">
          Показано {filteredAndSortedHeroes.length} из {heroes.length}
        </div>
      </div>

      {/* Сетка героев */}
      {filteredAndSortedHeroes.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: "#abd1c6" }}>
            Ничего не найдено
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredAndSortedHeroes.map((hero) => {
            const hasSocialLinks =
              !!hero.vkLink || !!hero.telegramLink || !!hero.youtubeLink;

            return (
              <Link key={hero.id} href={`/profile/${hero.id}`} className="block focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 rounded-2xl">
              <div
                className="p-5 rounded-2xl border transition-colors cursor-pointer bg-[#001e1d]/60 border-[#abd1c6]/30 hover:border-[#f9bc60]/60 hover:bg-[#004643]/70"
              >
                {/* Ранг */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getRankIcon(hero.rank) && (
                      <span className="text-2xl">{getRankIcon(hero.rank)}</span>
                    )}
                    <span 
                      className="text-lg font-bold" 
                      style={{ 
                        color: hero.rank <= 3 ? getRankBorder(hero.rank) : "#f9bc60" 
                      }}
                    >
                      #{hero.rank}
                    </span>
                  </div>
                  {hero.isSubscriber && (
                    <span className="text-sm px-3 py-1 rounded-full" style={{ 
                      backgroundColor: "rgba(249, 188, 96, 0.2)", 
                      color: "#f9bc60" 
                    }}>
                      Подписчик
                    </span>
                  )}
                </div>

                {/* Аватар и имя */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold"
                    style={{
                      backgroundImage: hero.avatar ? `url(${hero.avatar})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      color: hero.avatar ? "transparent" : "#001e1d",
                    }}
                  >
                    {!hero.avatar && hero.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#fffffe" }}>
                      {hero.name}
                    </h3>
                    <p className="text-sm" style={{ color: "#abd1c6" }}>
                      С {formatDate(hero.joinedAt)}
                    </p>
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className="text-center p-3 rounded-xl" 
                    style={{ 
                      backgroundColor: hero.rank <= 3 
                        ? `${getRankBorder(hero.rank)}20` 
                        : "rgba(249, 188, 96, 0.1)" 
                    }}
                  >
                    <p 
                      className="text-xl font-bold" 
                      style={{ 
                        color: hero.rank <= 3 ? getRankBorder(hero.rank) : "#f9bc60" 
                      }}
                    >
                      ₽{hero.totalDonated.toLocaleString()}
                    </p>
                    <p className="text-sm" style={{ color: "#abd1c6" }}>
                      Поддержал
                    </p>
                  </div>
                  <div 
                    className="text-center p-3 rounded-xl" 
                    style={{ 
                      backgroundColor: hero.rank <= 3 
                        ? `${getRankBorder(hero.rank)}15` 
                        : "rgba(171, 209, 198, 0.1)" 
                    }}
                  >
                    <p 
                      className="text-xl font-bold" 
                      style={{ 
                        color: hero.rank <= 3 ? getRankBorder(hero.rank) : "#abd1c6" 
                      }}
                    >
                      {hero.donationCount}
                    </p>
                    <p className="text-sm" style={{ color: "#abd1c6" }}>
                      Донатов
                    </p>
                  </div>
                </div>
                {/* Соцсети: фиксированное место, чтобы все карточки были одной высоты */}
                <div className="mt-4 min-h-[36px] flex flex-wrap gap-2 items-center">
                    {hasSocialLinks && hero.vkLink && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          window.open(hero.vkLink!, "_blank", "noopener,noreferrer");
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
                          window.open(hero.telegramLink!, "_blank", "noopener,noreferrer");
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
                          window.open(hero.youtubeLink!, "_blank", "noopener,noreferrer");
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
          )})}
        </div>
      )}
    </div>
  );
}
