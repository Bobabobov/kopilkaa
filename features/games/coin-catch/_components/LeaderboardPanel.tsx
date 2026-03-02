"use client";

import Link from "next/link";
import type { LeaderboardEntry } from "../_types";
import { getDisplayPlaces } from "./leaderboardUtils";
import { VkIcon, TelegramIcon, YoutubeIcon } from "./LeaderboardIcons";
import { playButtonSound } from "../_services/sfx";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { GAME_THEME } from "../_constants/theme";
import { cn } from "@/lib/utils";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

function leaderboardEntryKey(entry: LeaderboardEntry, index: number): string {
  return entry.userId ? `${entry.userId}-${entry.rank}` : `anon-${index}-${entry.displayName}-${entry.score}`;
}

export function LeaderboardPanel({ entries, onClose }: LeaderboardPanelProps) {
  const displayPlaces = entries.length > 0 ? getDisplayPlaces(entries) : [];
  const winner = entries.length > 0 ? entries[0] : null;

  const handleClose = () => {
    playButtonSound();
    onClose();
  };

  return (
    <Card
      className={cn(
        "absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col w-[min(calc(100vw-1rem),20rem)] sm:w-72 max-w-[calc(100vw-1rem)] rounded-2xl overflow-hidden border-2 backdrop-blur-md pointer-events-auto",
        GAME_THEME.bg.card,
        GAME_THEME.border.strong,
        GAME_THEME.shadow.card
      )}
      padding="none"
      style={{ maxHeight: "min(85dvh, calc(100vh - 5rem))" }}
      role="dialog"
      aria-labelledby="leaderboard-title"
      aria-modal="true"
    >
      <div className={cn("flex-shrink-0 px-4 py-3 border-b-2", GAME_THEME.bg.cardMuted, GAME_THEME.border.default)}>
        <h3 id="leaderboard-title" className={cn("text-base sm:text-lg font-bold tracking-tight drop-shadow-sm", GAME_THEME.text.accent)}>
          Топ недели
        </h3>
      </div>

      {winner && (
        <div className={cn("flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 mx-2 mt-2 rounded-xl border", GAME_THEME.bg.cardMuted, GAME_THEME.border.strong)}>
          <p className={cn("text-xs sm:text-sm leading-tight", GAME_THEME.text.primary)}>
            <span className="inline-block mr-1" aria-hidden>🏆</span>
            Победитель недели: <strong>{winner.displayName}</strong> — {winner.score}{" "}
            <span className={GAME_THEME.text.secondary}>(первым набрал {winner.score})</span>
          </p>
        </div>
      )}

      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y"
        style={{ WebkitOverflowScrolling: "touch", maxHeight: "12.5rem" }}
      >
        {entries.length === 0 ? (
          <p className={cn("px-4 py-6 text-center text-sm", GAME_THEME.text.secondary)}>
            На этой неделе пока нет результатов.
          </p>
        ) : (
          <ul className="divide-y divide-[#f9bc60]/20" role="list">
            {entries.map((entry, index) => (
              <li key={leaderboardEntryKey(entry, index)}>
                <div className={cn("flex items-center gap-2 px-3 py-2 sm:px-3 sm:py-2.5 hover:bg-[#f9bc60]/10 transition-colors active:bg-[#f9bc60]/15")}>
                  <span className="flex-shrink-0 w-6 text-center text-xs font-bold tabular-nums text-[#abd1c6]">
                    {displayPlaces[index]}.
                  </span>
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-[#0d2827] ring-1 ring-[#f9bc60]/30">
                    <img
                      src={entry.avatarUrl || "/default-avatar.png"}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    {entry.userId ? (
                      <Link
                        href={`/profile/${entry.userId}`}
                        className={cn("font-medium text-xs sm:text-sm truncate hover:underline underline-offset-1 transition-colors", GAME_THEME.text.primary, "hover:text-[#f9bc60]")}
                      >
                        {entry.displayName}
                      </Link>
                    ) : (
                      <span className={cn("font-medium text-xs sm:text-sm truncate", GAME_THEME.text.primary)}>
                        {entry.displayName}
                      </span>
                    )}
                    {(entry.vkLink || entry.telegramLink || entry.youtubeLink) && (
                      <span className="flex items-center gap-0.5 flex-shrink-0">
                        {entry.vkLink && (
                          <a
                            href={entry.vkLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors p-0.5 rounded"
                            title="VK"
                            aria-label="VK"
                          >
                            <VkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {entry.telegramLink && (
                          <a
                            href={entry.telegramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors p-0.5 rounded"
                            title="Telegram"
                            aria-label="Telegram"
                          >
                            <TelegramIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {entry.youtubeLink && (
                          <a
                            href={entry.youtubeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#abd1c6] hover:text-[#f9bc60] transition-colors p-0.5 rounded"
                            title="YouTube"
                            aria-label="YouTube"
                          >
                            <YoutubeIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                  <span className={cn("flex-shrink-0 font-bold text-xs sm:text-sm tabular-nums", GAME_THEME.text.accent)}>
                    {entry.score}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={cn("flex-shrink-0 p-3 border-t-2", GAME_THEME.border.default, GAME_THEME.bg.cardMuted)}>
        <Button
          type="button"
          className={cn("w-full py-2.5 sm:py-3 rounded-xl shadow-md", GAME_THEME.button.primary)}
          onClick={handleClose}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          aria-label="Закрыть таблицу лидеров"
        >
          Закрыть
        </Button>
      </div>
    </Card>
  );
}
