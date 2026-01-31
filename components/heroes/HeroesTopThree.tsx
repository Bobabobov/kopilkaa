// components/heroes/HeroesTopThree.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";
import { formatRub } from "@/lib/format";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  heroBadge?: HeroBadgeType | null;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: string;
  hasExtendedPlacement?: boolean;
  isSubscriber?: boolean; // backward-compatible
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

interface HeroesTopThreeProps {
  heroes: Hero[];
}

const DEFAULT_AVATAR = "/default-avatar.png";

export default function HeroesTopThree({ heroes }: HeroesTopThreeProps) {
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );
  const topThree = heroes
    .filter((hero) => hero.rank <= 3)
    .sort((a, b) => a.rank - b.rank);

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
      <div className="flex items-start justify-between gap-4 mb-4 sm:mb-5">
        <div>
          <div className="text-xs text-[#94a1b2]">Благодарность</div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#fffffe] inline-flex items-center gap-2">
            <LucideIcons.Trophy size="sm" className="text-[#f9bc60]" />
            Самые активные герои проекта
          </div>
        </div>
        <div className="hidden sm:block text-sm text-[#abd1c6]">
          Спасибо за вклад в развитие сообщества
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-end gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto px-2">
        {/* 2-е место */}
        {topThree[1] && (
          <Link
            href={`/profile/${topThree[1].id}`}
            className="order-2 sm:order-1 flex-1 max-w-full sm:max-w-[280px] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 rounded-2xl"
          >
            <div
              className="group relative p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all cursor-pointer text-center h-full flex flex-col bg-gradient-to-b from-white/6 to-white/3 hover:-translate-y-1 shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
              style={{
                borderColor: getRankColor(2),
                boxShadow: `0 0 22px ${getRankColor(2)}22`,
                minHeight: "240px",
              }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{getRankIcon(2)}</div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-2 sm:mb-3">
                <img
                  src={
                    failedAvatars[topThree[1].id]
                      ? DEFAULT_AVATAR
                      : topThree[1].avatar || DEFAULT_AVATAR
                  }
                  alt={topThree[1].name}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setFailedAvatars((prev) => ({
                      ...prev,
                      [topThree[1].id]: true,
                    }))
                  }
                />
              </div>
              <h4
                className="text-base sm:text-lg font-bold mb-2 break-words"
                style={{ color: "#fffffe" }}
              >
                {topThree[1].name}
              </h4>
              <div className="flex justify-center mb-2">
                <HeroBadge badge={topThree[1].heroBadge ?? null} size="md" />
              </div>
              <p
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(2) }}
              >
                {formatRub(topThree[1].totalDonated)}
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
            className="order-1 sm:order-2 flex-1 max-w-full sm:max-w-[300px] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 rounded-2xl"
          >
            <div
              className="group relative p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all cursor-pointer text-center h-full flex flex-col bg-gradient-to-b from-white/7 to-white/3 hover:-translate-y-1 shadow-[0_22px_58px_rgba(0,0,0,0.35)]"
              style={{
                borderColor: getRankColor(1),
                boxShadow: `0 0 30px ${getRankColor(1)}2e`,
                minHeight: "260px",
              }}
            >
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">
                {getRankIcon(1)}
              </div>
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-3 sm:mb-4">
                <img
                  src={
                    failedAvatars[topThree[0].id]
                      ? DEFAULT_AVATAR
                      : topThree[0].avatar || DEFAULT_AVATAR
                  }
                  alt={topThree[0].name}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setFailedAvatars((prev) => ({
                      ...prev,
                      [topThree[0].id]: true,
                    }))
                  }
                />
              </div>
              <h4
                className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: "#fffffe" }}
              >
                {topThree[0].name}
              </h4>
              <div className="flex justify-center mb-2">
                <HeroBadge badge={topThree[0].heroBadge ?? null} size="md" />
              </div>
              <p
                className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(1) }}
              >
                {formatRub(topThree[0].totalDonated)}
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
            className="order-3 flex-1 max-w-full sm:max-w-[280px] focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/60 rounded-2xl"
          >
            <div
              className="group relative p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all cursor-pointer text-center h-full flex flex-col bg-gradient-to-b from-white/6 to-white/3 hover:-translate-y-1 shadow-[0_18px_48px_rgba(0,0,0,0.28)]"
              style={{
                borderColor: getRankColor(3),
                boxShadow: `0 0 22px ${getRankColor(3)}22`,
                minHeight: "240px",
              }}
            >
              <div className="text-2xl sm:text-3xl mb-2">{getRankIcon(3)}</div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 mx-auto mb-2 sm:mb-3">
                <img
                  src={
                    failedAvatars[topThree[2].id]
                      ? DEFAULT_AVATAR
                      : topThree[2].avatar || DEFAULT_AVATAR
                  }
                  alt={topThree[2].name}
                  className="w-full h-full object-cover"
                  onError={() =>
                    setFailedAvatars((prev) => ({
                      ...prev,
                      [topThree[2].id]: true,
                    }))
                  }
                />
              </div>
              <h4
                className="text-base sm:text-lg font-bold mb-2 break-words"
                style={{ color: "#fffffe" }}
              >
                {topThree[2].name}
              </h4>
              <div className="flex justify-center mb-2">
                <HeroBadge badge={topThree[2].heroBadge ?? null} size="md" />
              </div>
              <p
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 break-words"
                style={{ color: getRankColor(3) }}
              >
                {formatRub(topThree[2].totalDonated)}
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
