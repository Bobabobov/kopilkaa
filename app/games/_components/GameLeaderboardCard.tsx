"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/skeleton";
import { getDisplayPlaces } from "./leaderboard-utils";
import type { LeaderboardEntry } from "./types";
import type { GameConfig } from "./games-config";
import { VkIcon, TelegramIcon, YoutubeIcon } from "@/features/games/coin-catch/_components/LeaderboardIcons";
import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";

const MEDAL_COLORS = [
  "text-[#f9bc60]",   // 1 — золото
  "text-slate-400",  // 2 — серебро
  "text-amber-700",  // 3 — бронза
] as const;

export interface GameLeaderboardCardProps {
  game: GameConfig;
  limit?: number;
}

export function GameLeaderboardCard({ game, limit = 10 }: GameLeaderboardCardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!game.leaderboardApi) return;
    fetch(`/api/games/${game.leaderboardApi}/leaderboard`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("fail"))))
      .then((data: { leaderboard: LeaderboardEntry[] }) => {
        setEntries((data.leaderboard ?? []).slice(0, limit));
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [game.leaderboardApi, limit]);

  const displayPlaces = getDisplayPlaces(entries);
  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  return (
    <Card variant="darkGlass" padding="none" className="overflow-hidden">
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-[#fffffe]">
          {game.title} — топ недели
        </h3>
        <Link
          href={game.href}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
            color: "#001e1d",
            boxShadow: "0 6px 20px rgba(249, 188, 96, 0.25)",
          }}
        >
          Играть
        </Link>
      </div>
      <CardContent className="p-5">
        {loading && <LeaderboardSkeleton />}
        {error && (
          <p className="text-sm text-white/50 py-8 text-center">
            Не удалось загрузить рейтинг
          </p>
        )}
        {!loading && !error && entries.length === 0 && (
          <p className="text-sm text-white/50 py-8 text-center">
            Пока нет результатов за неделю. Будьте первым!
          </p>
        )}
        {!loading && !error && entries.length > 0 && (
          <>
            {/* Подиум: 2 — 1 — 3, разные размеры: 1-е место крупнее */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 items-end">
                {[1, 0, 2].map((i) => {
                  const entry = top3[i];
                  if (!entry) return null;
                  const place = (i === 0 ? 2 : i === 1 ? 1 : 3) as 1 | 2 | 3;
                  const isFirst = place === 1;
                  const isSecond = place === 2;
                  const sizeClasses = isFirst
                    ? "min-h-[220px] sm:min-h-[240px] p-5 sm:p-6"
                    : isSecond
                      ? "min-h-[180px] sm:min-h-[200px] p-4 sm:p-5"
                      : "min-h-[160px] sm:min-h-[175px] p-4";
                  const avatarSize = isFirst ? "h-20 w-20 sm:h-24 sm:w-24" : isSecond ? "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]" : "h-14 w-14";
                  const medalSize = isFirst ? "text-3xl sm:text-4xl" : isSecond ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl";
                  const scoreSize = isFirst ? "text-xl sm:text-2xl" : "text-base sm:text-lg";
                  const hasSocialLinks = !!(entry.vkLink || entry.telegramLink || entry.youtubeLink);
                  const profileContent = (
                    <>
                      <Medal
                        className={cn(medalSize, "block", MEDAL_COLORS[place - 1])}
                        aria-hidden
                      />
                      <div className="mt-2 sm:mt-3 flex justify-center">
                        <Avatar
                          className={cn(
                            avatarSize,
                            "ring-2 flex-shrink-0",
                            isFirst ? "ring-[#f9bc60]/60 shadow-lg" : "ring-white/20"
                          )}
                        >
                          <AvatarImage src={entry.avatarUrl || "/default-avatar.png"} />
                          <AvatarFallback className="bg-white/10 text-white text-sm">
                            {entry.displayName.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p
                        className={cn(
                          "font-medium text-white truncate mt-2 px-1 text-center",
                          isFirst ? "text-base sm:text-lg" : "text-sm"
                        )}
                        title={entry.displayName}
                      >
                        {entry.displayName}
                      </p>
                      {isFirst && (
                        <span className="inline-block mt-0.5 text-xs font-medium" style={{ color: "#f9bc60" }} aria-hidden>
                          Лидер
                        </span>
                      )}
                      <p className={cn("font-bold mt-0.5", isFirst ? scoreSize : "text-white/90 " + scoreSize)} style={isFirst ? { color: "#f9bc60" } : undefined}>
                        {entry.score}
                      </p>
                    </>
                  );
                  const socialLinksBlock = hasSocialLinks && (
                    <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                      {entry.vkLink && (
                        <a href={entry.vkLink} target="_blank" rel="noopener noreferrer" className="text-[#0077FF] hover:text-[#5BA3FF] hover:bg-[#0077FF]/15 transition-colors p-1.5 rounded" title="VK" aria-label="VK">
                          <VkIcon className={cn(isFirst ? "w-5 h-5" : "w-4 h-4")} />
                        </a>
                      )}
                      {entry.telegramLink && (
                        <a href={entry.telegramLink} target="_blank" rel="noopener noreferrer" className="text-[#229ED9] hover:text-[#3DB4F2] hover:bg-[#229ED9]/15 transition-colors p-1.5 rounded" title="Telegram" aria-label="Telegram">
                          <TelegramIcon className={cn(isFirst ? "w-5 h-5" : "w-4 h-4")} />
                        </a>
                      )}
                      {entry.youtubeLink && (
                        <a href={entry.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:text-[#FF4444] hover:bg-[#FF0000]/15 transition-colors p-1.5 rounded" title="YouTube" aria-label="YouTube">
                          <YoutubeIcon className={cn(isFirst ? "w-5 h-5" : "w-4 h-4")} />
                        </a>
                      )}
                    </div>
                  );
                  return (
                    <div
                      key={`podium-${i}-${entry.userId ?? entry.displayName}-${entry.score}`}
                      className={cn(
                        "rounded-2xl border transition-all flex flex-col items-center justify-end text-center",
                        sizeClasses,
                        isFirst ? "border-[#f9bc60]/30" : "border-white/15"
                      )}
                      style={isFirst ? { background: "linear-gradient(165deg, rgba(255,255,255,0.08) 0%, rgba(249,188,96,0.08) 100%)" } : { background: "linear-gradient(165deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)" }}
                    >
                      <div className="w-full flex flex-col items-center">
                        {entry.userId ? (
                          <Link href={`/profile/${entry.userId}`} className="flex flex-col items-center hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50 focus:ring-inset rounded-2xl rounded-b-none">
                            {profileContent}
                          </Link>
                        ) : (
                          profileContent
                        )}
                        {socialLinksBlock}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Разделитель перед списком */}
            {rest.length > 0 && (
              <div className="border-t border-white/10 pt-4 mb-2" aria-hidden />
            )}
            {/* Список 4–10 (макс. 10 всего) */}
            {rest.length > 0 && (
              <ul className="space-y-1">
                {rest.map((entry, idx) => (
                  <LeaderboardRow
                    key={`row-${idx}-${entry.userId ?? entry.displayName}-${entry.score}`}
                    entry={entry}
                    place={displayPlaces[idx + 3]}
                    index={idx}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LeaderboardRow({ entry, place, index = 0 }: { entry: LeaderboardEntry; place: number; index?: number }) {
  const profileHref = entry.userId ? `/profile/${entry.userId}` : null;
  const isTopOfList = place <= 5;
  const rowContent = (
    <>
      <span className={cn(
        "w-8 text-center text-sm font-bold tabular-nums flex-shrink-0 rounded-md py-0.5",
        isTopOfList ? "text-[#f9bc60] bg-[#f9bc60]/15" : "text-white/60"
      )}>
        {place}
      </span>
      <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white/20">
        <AvatarImage src={entry.avatarUrl || "/default-avatar.png"} />
        <AvatarFallback className="bg-white/10 text-white/70 text-xs">
          {entry.displayName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 flex items-center gap-2">
        {profileHref ? (
          <Link
            href={profileHref}
            className="text-sm font-medium text-white truncate hover:underline underline-offset-2 transition-colors"
          >
            {entry.displayName}
          </Link>
        ) : (
          <span className="text-sm font-medium text-white truncate">
            {entry.displayName}
          </span>
        )}
        {(entry.vkLink || entry.telegramLink || entry.youtubeLink) && (
          <span className="flex items-center gap-1 flex-shrink-0">
            {entry.vkLink && (
              <a href={entry.vkLink} target="_blank" rel="noopener noreferrer" className="text-[#0077FF] hover:text-[#5BA3FF] hover:bg-[#0077FF]/15 transition-colors p-1 rounded" title="VK" aria-label="VK">
                <VkIcon className="w-4 h-4" />
              </a>
            )}
            {entry.telegramLink && (
              <a href={entry.telegramLink} target="_blank" rel="noopener noreferrer" className="text-[#229ED9] hover:text-[#3DB4F2] hover:bg-[#229ED9]/15 transition-colors p-1 rounded" title="Telegram" aria-label="Telegram">
                <TelegramIcon className="w-4 h-4" />
              </a>
            )}
            {entry.youtubeLink && (
              <a href={entry.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-[#FF0000] hover:text-[#FF4444] hover:bg-[#FF0000]/15 transition-colors p-1 rounded" title="YouTube" aria-label="YouTube">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            )}
          </span>
        )}
      </div>
      <span className="text-sm font-bold tabular-nums flex-shrink-0" style={{ color: "#f9bc60" }}>
        {entry.score}
      </span>
    </>
  );

  return (
    <li>
      <div className={cn(
        "flex items-center gap-3 py-3 px-4 rounded-xl transition-colors border border-transparent",
        index % 2 === 0 ? "bg-white/[0.04]" : "bg-white/[0.02]",
        "hover:bg-white/10 hover:border-white/10"
      )}>
        {rowContent}
      </div>
    </li>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[100px] rounded" />
            <Skeleton className="h-4 w-12 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
