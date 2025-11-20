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
  joinedAt: Date;
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
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: "#fffffe" }}>
        🏆 Топ донатеры
      </h3>
      
      <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 max-w-4xl mx-auto">
        {/* 2-е место */}
        {topThree[1] && (
          <Link href={`/profile/${topThree[1].id}`} className="order-2 md:order-1">
            <div 
              className="p-4 rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(2),
                boxShadow: `0 0 15px ${getRankColor(2)}30`,
                minWidth: "200px"
              }}
            >
              <div className="text-3xl mb-2">{getRankIcon(2)}</div>
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold mx-auto mb-3"
                style={{
                  backgroundImage: topThree[1].avatar ? `url(${topThree[1].avatar})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: topThree[1].avatar ? "transparent" : "#001e1d",
                }}
              >
                {!topThree[1].avatar && topThree[1].name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: "#fffffe" }}>
                {topThree[1].name}
              </h4>
              <p className="text-xl font-bold mb-3" style={{ color: getRankColor(2) }}>
                ₽{topThree[1].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[40px] flex justify-center gap-2 flex-wrap">
                  {topThree[1].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(topThree[1].vkLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[1].telegramLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[1].youtubeLink!, "_blank", "noopener,noreferrer");
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
          <Link href={`/profile/${topThree[0].id}`} className="order-1 md:order-2">
            <div 
              className="p-6 rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center transform md:scale-110"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(1),
                boxShadow: `0 0 25px ${getRankColor(1)}40`,
                minWidth: "220px"
              }}
            >
              <div className="text-4xl mb-3">{getRankIcon(1)}</div>
              <div
                className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                style={{
                  backgroundImage: topThree[0].avatar ? `url(${topThree[0].avatar})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: topThree[0].avatar ? "transparent" : "#001e1d",
                }}
              >
                {!topThree[0].avatar && topThree[0].name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-xl font-bold mb-3" style={{ color: "#fffffe" }}>
                {topThree[0].name}
              </h4>
              <p className="text-2xl font-bold mb-3" style={{ color: getRankColor(1) }}>
                ₽{topThree[0].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[40px] flex justify-center gap-2 flex-wrap">
                  {topThree[0].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(topThree[0].vkLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[0].telegramLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[0].youtubeLink!, "_blank", "noopener,noreferrer");
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
          <Link href={`/profile/${topThree[2].id}`} className="order-3">
            <div 
              className="p-4 rounded-2xl backdrop-blur-sm border-2 transition-colors cursor-pointer text-center"
              style={{
                backgroundColor: "rgba(0, 70, 67, 0.6)",
                borderColor: getRankColor(3),
                boxShadow: `0 0 15px ${getRankColor(3)}30`,
                minWidth: "200px"
              }}
            >
              <div className="text-3xl mb-2">{getRankIcon(3)}</div>
              <div
                className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-xl font-bold mx-auto mb-3"
                style={{
                  backgroundImage: topThree[2].avatar ? `url(${topThree[2].avatar})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: topThree[2].avatar ? "transparent" : "#001e1d",
                }}
              >
                {!topThree[2].avatar && topThree[2].name.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-lg font-bold mb-2" style={{ color: "#fffffe" }}>
                {topThree[2].name}
              </h4>
              <p className="text-xl font-bold mb-3" style={{ color: getRankColor(3) }}>
                ₽{topThree[2].totalDonated.toLocaleString()}
              </p>
              <div className="mt-1 min-h-[40px] flex justify-center gap-2 flex-wrap">
                  {topThree[2].vkLink && (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        window.open(topThree[2].vkLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[2].telegramLink!, "_blank", "noopener,noreferrer");
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
                        window.open(topThree[2].youtubeLink!, "_blank", "noopener,noreferrer");
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














