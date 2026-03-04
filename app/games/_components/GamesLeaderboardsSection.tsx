"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { GameLeaderboardCard } from "./GameLeaderboardCard";
import { LeaderboardPlaceholderCard } from "./LeaderboardPlaceholderCard";
import { GAMES_LIST, UPCOMING_LEADERBOARD_GAMES } from "./games-config";

export function GamesLeaderboardsSection() {
  const gamesWithLeaderboard = GAMES_LIST.filter(
    (g) => g.leaderboardApi && !g.hiddenFromList
  );
  const hasAny = gamesWithLeaderboard.length > 0 || UPCOMING_LEADERBOARD_GAMES.length > 0;

  if (!hasAny) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-white/10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fffffe] flex items-center gap-2">
            <motion.span className="text-2xl sm:text-3xl inline-block" style={{ color: "#f9bc60" }} aria-hidden initial={{ scale: 0, rotate: -20 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 180, damping: 12 }}>
              <Trophy className="w-8 h-8 sm:w-9 sm:h-9" />
            </motion.span>
            Лидеры недели
            <span className="hidden sm:block w-10 h-px rounded-full bg-white/20 ml-1" aria-hidden />
          </h2>
          <p className="text-[#94a1b2] text-sm sm:text-base mt-1">
            Топ игроков по каждой игре. Кликайте на имя или аватар — переход в профиль. Рейтинг обновляется еженедельно.
          </p>
        </motion.div>
        <div className="space-y-6">
          {gamesWithLeaderboard.map((game, i) => (
            <motion.div
              key={game.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 90 }}
            >
              <GameLeaderboardCard game={game} limit={10} />
            </motion.div>
          ))}
          {UPCOMING_LEADERBOARD_GAMES.map((item, i) => (
            <LeaderboardPlaceholderCard
              key={`upcoming-${i}-${item.title}`}
              title={item.title}
              index={gamesWithLeaderboard.length + i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
