"use client";

import Link from "next/link";
import type { LeaderboardEntry } from "../_types";
import { getDisplayPlaces } from "./leaderboardUtils";
import { VkIcon, TelegramIcon, YoutubeIcon } from "./LeaderboardIcons";
import { playButtonSound } from "../_services/sfx";

interface LeaderboardPanelProps {
  entries: LeaderboardEntry[];
  onClose: () => void;
}

export function LeaderboardPanel({ entries, onClose }: LeaderboardPanelProps) {
  const displayPlaces = entries.length > 0 ? getDisplayPlaces(entries) : [];
  const winner = entries.length > 0 ? entries[0] : null;

  return (
    <div
      className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col w-[min(calc(100vw-1rem),20rem)] sm:w-72 max-w-[calc(100vw-1rem)] rounded-2xl overflow-hidden bg-[#001e1d] border-2 border-[#f9bc60]/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-md pointer-events-auto"
      style={{ maxHeight: "min(85dvh, calc(100vh - 5rem))" }}
    >
      <div className="flex-shrink-0 px-4 py-3 sm:px-4 sm:py-3 bg-[#0d2827]/80 border-b-2 border-[#f9bc60]/40">
        <h3 className="text-base sm:text-lg font-bold text-[#f9bc60] tracking-tight drop-shadow-sm">
          Топ недели
        </h3>
      </div>

      {winner && (
        <div className="flex-shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 mx-2 mt-2 rounded-xl bg-[#0d2827] border border-[#f9bc60]/50">
          <p className="text-xs sm:text-sm text-[#fffffe] leading-tight">
            <span className="inline-block mr-1" aria-hidden>
              🏆
            </span>
            Победитель недели: <strong>{winner.displayName}</strong> —{" "}
            {winner.score}{" "}
            <span className="text-[#abd1c6]">
              (первым набрал {winner.score})
            </span>
          </p>
        </div>
      )}

      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y"
        style={{
          WebkitOverflowScrolling: "touch",
          maxHeight: "12.5rem",
        }}
      >
        {entries.length === 0 ? (
          <p className="px-4 py-6 text-center text-[#abd1c6] text-sm">
            На этой неделе пока нет результатов.
          </p>
        ) : (
          <ul className="divide-y divide-[#f9bc60]/20">
            {entries.map((entry, index) => (
              <li key={`${index}-${entry.displayName}-${entry.score}`}>
                <div className="flex items-center gap-2 px-3 py-2 sm:px-3 sm:py-2.5 hover:bg-[#f9bc60]/10 transition-colors active:bg-[#f9bc60]/15">
                  <span className="flex-shrink-0 w-6 text-center text-xs font-bold text-[#abd1c6] tabular-nums">
                    {displayPlaces[index]}.
                  </span>
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-[#0d2827] ring-1 ring-[#f9bc60]/30">
                    <img
                      src={entry.avatarUrl || "/default-avatar.png"}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/default-avatar.png";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    {entry.userId ? (
                      <Link
                        href={`/profile/${entry.userId}`}
                        className="text-[#fffffe] font-medium text-xs sm:text-sm truncate hover:text-[#f9bc60] hover:underline underline-offset-1 transition-colors"
                      >
                        {entry.displayName}
                      </Link>
                    ) : (
                      <span className="text-[#fffffe] font-medium text-xs sm:text-sm truncate">
                        {entry.displayName}
                      </span>
                    )}
                    {(entry.vkLink ||
                      entry.telegramLink ||
                      entry.youtubeLink) && (
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
                  <span className="flex-shrink-0 text-[#f9bc60] font-bold text-xs sm:text-sm tabular-nums">
                    {entry.score}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-shrink-0 p-3 sm:p-3 border-t-2 border-[#f9bc60]/40 bg-[#0d2827]/60">
        <button
          type="button"
          onClick={() => {
            playButtonSound();
            onClose();
          }}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          className="w-full py-2.5 sm:py-3 rounded-xl bg-[#f9bc60] text-[#001e1d] font-bold text-sm sm:text-base hover:bg-[#ffd700] active:scale-[0.98] transition-all shadow-md"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
