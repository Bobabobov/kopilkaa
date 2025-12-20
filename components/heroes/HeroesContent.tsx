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
  joinedAt: Date;
  isSubscriber: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

interface HeroesContentProps {
  heroes: Hero[];
  error?: string | null;
  onRetry?: () => void;
}

export default function HeroesContent({ heroes, error, onRetry }: HeroesContentProps) {
  if (error) {
    return <HeroesErrorState error={error} onRetry={onRetry} />;
  }

  if (heroes.length === 0) {
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
          <HeroesGridStats heroes={heroes} />
        </motion.div>

        {/* Список героев */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HeroesGrid heroes={heroes} />
        </motion.div>
        
      </div>
    </div>
  );
}
