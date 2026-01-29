"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { GameEngine } from "../_core/engine";
import type { LeaderboardEntry } from "../_types";
import { submitScore, getLeaderboard } from "../_services/api";
import { playButtonSound, setAudioSettings } from "../_services/sfx";

interface GameCanvasProps {
  onLeaderboardClick?: () => void;
}

// Иконки соцсетей (inline SVG)
function VkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.49-.085.744-.576.744z" />
    </svg>
  );
}
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/** Место в рейтинге на клиенте: одинаковый score — одно место */
function getDisplayPlaces(entries: LeaderboardEntry[]): number[] {
  const places: number[] = [];
  for (let i = 0; i < entries.length; i++) {
    if (i === 0 || entries[i].score < entries[i - 1].score) {
      places.push(i + 1);
    } else {
      places.push(places[i - 1]);
    }
  }
  return places;
}

function LeaderboardPanel({
  entries,
  onClose,
}: {
  entries: LeaderboardEntry[];
  onClose: () => void;
}) {
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
            <span className="inline-block mr-1" aria-hidden>🏆</span>
            Победитель недели: <strong>{winner.displayName}</strong> — {winner.score}{" "}
            <span className="text-[#abd1c6]">(первым набрал {winner.score})</span>
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
                        (e.target as HTMLImageElement).src = "/default-avatar.png";
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
                  <span className="flex-shrink-0 text-[#f9bc60] font-bold text-xs sm:text-sm tabular-nums">
                    {entry.score}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Кнопка закрыть — всегда видна внизу */}
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

export function GameCanvas({ onLeaderboardClick }: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAudioSetup, setShowAudioSetup] = useState(true);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.6);
  const scoreSubmittedRef = useRef(false);
  const onLeaderboardClickRef = useRef(onLeaderboardClick);

  useEffect(() => {
    onLeaderboardClickRef.current = onLeaderboardClick;
  }, [onLeaderboardClick]);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    const container = containerRef.current;

    const initGame = () => {
      if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
        setTimeout(initGame, 100);
        return;
      }

      const handleGameOver = async (score: number) => {
        if (!scoreSubmittedRef.current) {
          scoreSubmittedRef.current = true;
          await submitScore(score);
          const updated = await getLeaderboard();
          setLeaderboard(updated);
        }
      };

      const handleLeaderboardClick = () => {
        if (onLeaderboardClickRef.current) {
          onLeaderboardClickRef.current();
        }
        setShowLeaderboard(true);
      };

      const engine = new GameEngine(container, handleGameOver, handleLeaderboardClick);
      engineRef.current = engine;

      engine.init().catch((error) => {
        console.error("Error initializing game:", error);
      });
    };

    const timeoutId = setTimeout(initGame, 50);

    getLeaderboard().then(setLeaderboard).catch(() => {});

    return () => {
      clearTimeout(timeoutId);
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      scoreSubmittedRef.current = false;
    };
  }, []);

  const applyAudioSettings = (nextMuted: boolean) => {
    setAudioMuted(nextMuted);
    setAudioSettings({ muted: nextMuted, volume: audioVolume });
    engineRef.current?.applyMusicVolume();
    playButtonSound();
    setShowAudioSetup(false);
  };

  const handleShowLeaderboard = () => {
    playButtonSound();
    setShowLeaderboard(true);
    if (onLeaderboardClick) {
      onLeaderboardClick();
    }
  };

  return (
    <div
      className="relative w-full h-full min-h-0 overflow-hidden"
      style={{ maxWidth: "100vw", maxHeight: "100%", boxSizing: "border-box" }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{
          minHeight: 0,
          position: "relative",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
      {showAudioSetup && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-[min(92vw,360px)] rounded-2xl border-2 border-[#f9bc60]/60 bg-[#001e1d]/95 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <h3 className="text-lg font-bold text-[#fffffe] text-center">
              Настройка звука
            </h3>
            <p className="mt-2 text-sm text-[#abd1c6] text-center">
              Можно отключить звук или выбрать громкость
            </p>
            <div className="mt-4">
              <label className="block text-xs uppercase tracking-wide text-[#abd1c6] mb-2">
                Громкость
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(audioVolume * 100)}
                onChange={(e) => {
                  const next = Number(e.target.value) / 100;
                  setAudioVolume(next);
                  setAudioSettings({ muted: false, volume: next });
                  engineRef.current?.applyMusicVolume();
                  engineRef.current?.previewMusic();
                }}
                className="w-full accent-[#f9bc60]"
              />
              <div className="mt-1 text-xs text-[#f9bc60] text-right">
                {Math.round(audioVolume * 100)}%
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => applyAudioSettings(true)}
                className="flex-1 py-2.5 rounded-xl border border-[#f9bc60]/60 text-[#f9bc60] text-sm font-bold hover:bg-[#f9bc60]/10 transition"
              >
                Без звука
              </button>
              <button
                type="button"
                onClick={() => applyAudioSettings(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#f9bc60] text-[#001e1d] text-sm font-bold hover:bg-[#ffd700] transition"
              >
                Начать
              </button>
            </div>
          </div>
        </div>
      )}
      {showLeaderboard && (
        <LeaderboardPanel entries={leaderboard} onClose={() => setShowLeaderboard(false)} />
      )}
      {!showLeaderboard && (
        <button
          type="button"
          onClick={handleShowLeaderboard}
          onPointerDown={() => playButtonSound()}
          onPointerEnter={() => playButtonSound()}
          onTouchStart={() => playButtonSound()}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-[#001e1d]/95 border-2 border-[#f9bc60]/40 rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-[#f9bc60] hover:bg-[#001e1d] hover:border-[#f9bc60]/60 transition-colors backdrop-blur-sm z-10 shadow-md"
        >
          <span className="hidden sm:inline">Топ недели</span>
          <span className="sm:hidden">Топ</span>
        </button>
      )}
    </div>
  );
}
