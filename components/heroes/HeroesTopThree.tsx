// components/heroes/HeroesTopThree.tsx
"use client";
import Link from "next/link";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";

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

interface HeroesTopThreeProps {
  heroes: Hero[];
}

export default function HeroesTopThree({ heroes }: HeroesTopThreeProps) {
  const topThree = heroes.filter(hero => hero.rank <= 3).sort((a, b) => a.rank - b.rank);

  if (topThree.length === 0) return null;

  const openExternal = (raw?: string | null) => {
    if (!raw) return;
    const v = raw.trim();
    if (!/^https?:\/\//i.test(v) && !/^tg:\/\//i.test(v)) return;
    window.open(v, "_blank", "noopener,noreferrer");
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

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "#FFD700";
      case 2:
        return "#C0C0C0";
      case 3:
        return "#CD7F32";
      default:
        return "#f9bc60";
    }
  };

  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center px-4" style={{ color: "#fffffe" }}>
        🏆 Топ донатеры
      </h3>
      
      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-end gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-2">
        {/* 2-е место */}
        {topThree[1] && (
          <Link
            href={`/profile/${topThree[1].id}`}
            className="order-2 sm:order-1 flex-1 max-w-full sm:max-w-[280px]"
          >
            <div 
              className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center h-full flex flex-col"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(2),
                boxShadow: `0 0 15px ${getRankColor(2)}30`,
                minHeight: "240px"
              }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{getRankIcon(2)}</div>
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-2 sm:mb-3"
                style={{
                  backgroundImage: `url(${topThree[1].avatar || "/default-avatar.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "transparent",
                }}
              >
              </div>
              <h4 className="text-base sm:text-lg font-bold mb-2 break-words" style={{ color: "#fffffe" }}>
                {topThree[1].name}
              </h4>
              <p
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(2) }}
              >
                ₽{topThree[1].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[36px] sm:min-h-[40px] flex justify-center gap-1.5 sm:gap-2 flex-wrap mt-auto">
                  {topThree[1].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[1].vkLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                    >
                      <VKIcon className="w-3.5 h-3.5" />
                      <span>VK</span>
                    </button>
                  )}
                  {topThree[1].telegramLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[1].telegramLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                    >
                      <TelegramIcon className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </button>
                  )}
                  {topThree[1].youtubeLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[1].youtubeLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                    </button>
                  )}
              </div>
            </div>
          </Link>
        )}

        {/* 1-е место */}
        {topThree[0] && (
          <Link
            href={`/profile/${topThree[0].id}`}
            className="order-1 sm:order-2 flex-1 max-w-full sm:max-w-[300px]"
          >
            <div 
              className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center h-full flex flex-col"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(1),
                boxShadow: `0 0 25px ${getRankColor(1)}40`,
                minHeight: "260px"
              }}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{getRankIcon(1)}</div>
              <div
                className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-3 sm:mb-4"
                style={{
                  backgroundImage: `url(${topThree[0].avatar || "/default-avatar.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "transparent",
                }}
              >
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 break-words" style={{ color: "#fffffe" }}>
                {topThree[0].name}
              </h4>
              <p
                className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(1) }}
              >
                ₽{topThree[0].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[36px] sm:min-h-[40px] flex justify-center gap-1.5 sm:gap-2 flex-wrap mt-auto">
                  {topThree[0].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[0].vkLink);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                    >
                      <VKIcon className="w-3.5 h-3.5" />
                      <span>VK</span>
                    </button>
                  )}
                  {topThree[0].telegramLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[0].telegramLink);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                    >
                      <TelegramIcon className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </button>
                  )}
                  {topThree[0].youtubeLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[0].youtubeLink);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                    </button>
                  )}
              </div>
            </div>
          </Link>
        )}

        {/* 3-е место */}
        {topThree[2] && (
          <Link
            href={`/profile/${topThree[2].id}`}
            className="order-3 flex-1 max-w-full sm:max-w-[280px]"
          >
            <div 
              className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center h-full flex flex-col"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(3),
                boxShadow: `0 0 15px ${getRankColor(3)}30`,
                minHeight: "240px"
              }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{getRankIcon(3)}</div>
              <div
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-lg sm:text-xl font-bold mx-auto mb-2 sm:mb-3"
                style={{
                  backgroundImage: `url(${topThree[2].avatar || "/default-avatar.png"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: "transparent",
                }}
              >
              </div>
              <h4 className="text-base sm:text-lg font-bold mb-2 break-words" style={{ color: "#fffffe" }}>
                {topThree[2].name}
              </h4>
              <p
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(3) }}
              >
                ₽{topThree[2].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[36px] sm:min-h-[40px] flex justify-center gap-1.5 sm:gap-2 flex-wrap mt-auto">
                  {topThree[2].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[2].vkLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#4c75a3]/60 text-[#4c75a3] text-xs font-semibold bg-[#4c75a3]/10 hover:bg-[#4c75a3]/20 transition-colors"
                    >
                      <VKIcon className="w-3.5 h-3.5" />
                      <span>VK</span>
                    </button>
                  )}
                  {topThree[2].telegramLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[2].telegramLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#229ED9]/60 text-[#229ED9] text-xs font-semibold bg-[#229ED9]/10 hover:bg-[#229ED9]/20 transition-colors"
                    >
                      <TelegramIcon className="w-3.5 h-3.5" />
                      <span>Telegram</span>
                    </button>
                  )}
                  {topThree[2].youtubeLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openExternal(topThree[2].youtubeLink);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#ff4f45]/60 text-[#ff4f45] text-xs font-semibold bg-[#ff4f45]/10 hover:bg-[#ff4f45]/20 transition-colors"
                    >
                      <YouTubeIcon className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                    </button>
                  )}
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}














