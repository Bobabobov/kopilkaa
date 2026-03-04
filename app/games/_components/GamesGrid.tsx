"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import type { GameConfig } from "./games-config";
import { GAMES_LIST, COMING_SOON } from "./games-config";

/** Игры, которые показываются на странице /games (без hiddenFromList) */
const VISIBLE_GAMES = GAMES_LIST.filter((g) => !g.hiddenFromList);
import { cn } from "@/lib/utils";
import { Gamepad2, Trophy, Scale, Timer, Hourglass, Clock } from "lucide-react";

export function GamesGrid() {
  const perks = [
    { icon: Trophy, label: "Еженедельный топ" },
    { icon: Scale, label: "Честные правила" },
    { icon: Timer, label: "Ограниченные попытки" },
  ];

  return (
    <section id="games-grid" className="scroll-mt-6 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120 }}
          className="flex flex-wrap items-center gap-3 mb-2"
        >
          <motion.span className="text-2xl sm:text-3xl inline-block" aria-hidden initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
            <Gamepad2 className="w-8 h-8 sm:w-9 sm:h-9" style={{ color: "#f9bc60" }} />
          </motion.span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#fffffe]">Выберите игру</h2>
          <span className="hidden sm:block w-12 h-px rounded-full bg-white/20" aria-hidden />
        </motion.div>
        <p className="text-[#94a1b2] text-sm sm:text-base mb-6">
          Нажмите на карточку или кнопку «Играть», чтобы начать
        </p>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }} className="mb-10">
          <Card variant="darkGlass" padding="md">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {perks.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="flex items-center gap-2 text-[#abd1c6] text-sm">
                    <Icon className="w-5 h-5 flex-shrink-0" style={{ color: "#f9bc60" }} aria-hidden />
                    <span>{p.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        <div className="space-y-8">
          {VISIBLE_GAMES.map((game, i) => (
            <GameCard
              key={game.href}
              game={game}
              index={i}
              featured={i === 0}
              unavailableUntil={null}
            />
          ))}

          <div className="pt-6">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#94a1b2] text-sm mb-4 flex items-center gap-2"
            >
              <Hourglass className="w-4 h-4 inline-block mr-1" style={{ color: "#f9bc60" }} aria-hidden /> Скоро появятся
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COMING_SOON.map((item, index) => (
                <ComingSoonCard key={`soon-${index}`} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GameCard({
  game,
  index,
  featured,
  unavailableUntil,
}: {
  game: GameConfig;
  index: number;
  featured?: boolean;
  /** Для монетки: "ДД.ММ.ГГГГ" или "week" — тогда показываем "доступна через неделю" / "доступна с даты" */
  unavailableUntil?: string | null;
}) {
  const isUnavailable = unavailableUntil != null;
  const imageWrapper = (
    <div
      className={cn(
        "relative bg-black/20 overflow-hidden",
        featured ? "h-52 sm:h-64 sm:w-80" : "h-44 sm:h-52 sm:w-72",
        isUnavailable && "cursor-default"
      )}
    >
      <Image
        src={game.image}
        alt={game.title}
        fill
        className={cn(
          "object-cover transition-transform duration-300",
          !isUnavailable && "group-hover:scale-105"
        )}
        sizes="(max-width: 640px) 100vw, 320px"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent sm:from-transparent sm:via-transparent sm:to-black/30" />
      <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:bottom-3 sm:left-auto">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(249,188,96,0.2)", color: "#f9bc60", border: "1px solid rgba(249,188,96,0.4)" }}>
          <Trophy className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          {game.badge}
        </span>
      </div>
    </div>
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.08, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "rounded-2xl border overflow-hidden relative border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.2)] transition-all duration-300",
        "bg-[linear-gradient(165deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)]",
        !isUnavailable && "hover:border-[#f9bc60]/30 hover:shadow-lg hover:shadow-black/20"
      )}
    >
      {featured && !isUnavailable && (
        <div className="absolute left-0 top-6 w-1 h-12 rounded-r-full z-10" style={{ background: "linear-gradient(to bottom, rgba(249,188,96,0.5), rgba(249,188,96,0.2))" }} aria-hidden />
      )}
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {isUnavailable ? (
          <div className="block flex-shrink-0 group cursor-default">{imageWrapper}</div>
        ) : (
          <Link href={game.href} className="block flex-shrink-0 group">
            {imageWrapper}
          </Link>
        )}
        <div className="flex flex-col justify-center p-5 sm:p-6 flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            {game.title}
          </h3>
          <p className="text-white/70 text-sm sm:text-base mt-1">
            {game.description}
          </p>
          <div className="mt-4">
            {isUnavailable ? (
              <p className="text-sm sm:text-base font-medium flex items-center gap-2" style={{ color: "#f9bc60" }}>
                <Clock className="w-4 h-4 flex-shrink-0" aria-hidden />
                {unavailableUntil === "week"
                  ? "Игра будет доступна через неделю"
                  : `Игра будет доступна с ${unavailableUntil}`}
              </p>
            ) : (
              <motion.div whileTap={{ scale: 0.96 }} className="inline-block">
                <Link
                  href={game.href}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl font-semibold transition-all hover:opacity-90",
                    featured ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm"
                  )}
                  style={{
                    background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                    color: "#001e1d",
                    boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                  }}
                >
                  Играть
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ComingSoonCard({
  item,
  index,
}: {
  item: { title: string; description: string };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + index * 0.06, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-dashed border-white/20 p-5 hover:border-white/30 transition-colors cursor-default relative overflow-hidden"
      style={{ background: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)" }}
    >
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60" style={{ background: "rgba(249,188,96,0.1)" }} aria-hidden />
      <div className="flex items-center gap-3 relative">
        <motion.div
          className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-[#94a1b2]"
          style={{ background: "rgba(249,188,96,0.1)", border: "1px solid rgba(249,188,96,0.2)" }}
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
        >
          ?
        </motion.div>
        <div>
          <h3 className="font-semibold text-[#abd1c6]">{item.title}</h3>
          <p className="text-sm text-[#94a1b2] mt-0.5">{item.description}</p>
        </div>
      </div>
    </motion.div>
  );
}
