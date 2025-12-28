// components/heroes/HeroesContent.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
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
  isSubscriber: boolean;
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
    <div className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Картинка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10 md:mb-12 text-center"
        >
          <Image
            src="/hero.png"
            alt="Герои"
            width={400}
            height={400}
            className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
            loading="lazy"
          />
        </motion.div>
        
        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <HeroesGridStats stats={stats} />
        </motion.div>

        {/* Список героев */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
