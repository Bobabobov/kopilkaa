// components/heroes/HeroesContent.tsx
"use client";
import { motion } from "framer-motion";
import HeroesGridStats from "./HeroesGridStats";
import HeroesGrid from "./HeroesGrid";
import HeroesEmptyState from "./HeroesEmptyState";
import HeroesErrorState from "./HeroesErrorState";

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

interface HeroesContentProps {
  topThree: Hero[];
  heroes: Hero[];
  listTotal: number;
  stats: {
    totalHeroes: number;
    totalDonated: number;
    subscribersCount: number;
    averageDonation: number;
  };
  sortBy: "total" | "count" | "date";
  onSortChange: (sort: "total" | "count" | "date") => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  hasMore: boolean;
  loadingMore: boolean;
  observerTargetRef: React.RefObject<HTMLDivElement | null>;
  error?: string | null;
  onRetry?: () => void;
}

export default function HeroesContent({
  topThree,
  heroes,
  listTotal,
  stats,
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
  hasMore,
  loadingMore,
  observerTargetRef,
  error,
  onRetry,
}: HeroesContentProps) {
  if (error) {
    return <HeroesErrorState error={error} onRetry={onRetry} />;
  }

  if (stats.totalHeroes === 0) {
    return <HeroesEmptyState />;
  }

  return (
    <div
      id="heroes-list"
      className="pb-14 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10 md:space-y-12">
        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[28px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-5 sm:p-6 md:p-7 shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
        >
          <div className="flex items-center justify-between gap-4 mb-4 sm:mb-5">
            <div>
              <div className="text-xs text-[#94a1b2]">Сводка раздела</div>
              <div className="text-xl sm:text-2xl font-bold text-[#fffffe]">
                Статистика
              </div>
            </div>
            <div className="hidden sm:block text-sm text-[#abd1c6]">
              Данные обновляются при загрузке списка
            </div>
          </div>
          <HeroesGridStats stats={stats} />
        </motion.div>

        {/* Список героев */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="rounded-[28px] border border-white/10 bg-white/5/60 backdrop-blur-xl p-5 sm:p-6 md:p-7 shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
        >
          <HeroesGrid
            heroes={heroes}
            topThree={topThree}
            total={listTotal}
            searchTerm={searchTerm}
            onSearchChange={onSearchChange}
            sortBy={sortBy}
            onSortChange={onSortChange}
            hasMore={hasMore}
            loadingMore={loadingMore}
            observerTargetRef={observerTargetRef}
          />
        </motion.div>
      </div>
    </div>
  );
}
