// components/heroes/HeroesGrid.tsx
"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import HeroesFilters from "./HeroesFilters";
import HeroesTopThree from "./HeroesTopThree";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: Date;
  isSubscriber: boolean;
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h3 className="text-3xl font-bold mb-3 md:mb-0" style={{ color: "#fffffe" }}>
          Все донатеры
        </h3>
        <div className="text-lg" style={{ color: "#abd1c6" }}>
          {filteredAndSortedHeroes.length} из {heroes.length}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedHeroes.map((hero) => (
            <Link key={hero.id} href={`/profile/${hero.id}`}>
              <div
                className="p-6 rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: "rgba(0, 70, 67, 0.6)",
                  borderColor: getRankBorder(hero.rank),
                  boxShadow: hero.rank <= 3 ? `0 0 20px ${getRankBorder(hero.rank)}30` : "none",
                }}
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
                <div className="flex items-center gap-4 mb-5">
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
                <div className="grid grid-cols-2 gap-4">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
