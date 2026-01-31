import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { HeroBadge } from "@/components/ui/HeroBadge";
import { renderHighlightedText } from "./highlight";
import type { Story } from "./types";

interface StoryCardContentProps {
  story: Story;
  isRead: boolean;
  liked: boolean;
  likesCount: number;
  isLiking: boolean;
  isAuthenticated: boolean;
  query: string;
  authorName: string;
  mainImage: string;
  amountText: string | null;
  onCardClick: () => void;
  onCardKeyDown: (event: React.KeyboardEvent) => void;
  onLike: (event: React.MouseEvent) => void;
}

export function StoryCardContent({
  story,
  isRead,
  liked,
  likesCount,
  isLiking,
  isAuthenticated,
  query,
  authorName,
  mainImage,
  amountText,
  onCardClick,
  onCardKeyDown,
  onLike,
}: StoryCardContentProps) {
  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={`Открыть историю: ${story.title}`}
      onClick={onCardClick}
      onKeyDown={onCardKeyDown}
      className="relative bg-gradient-to-br from-white/98 via-white/95 to-white/90 backdrop-blur-2xl rounded-3xl p-0 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-700 border border-[#abd1c6]/50 hover:border-[#f9bc60]/80 hover:-translate-y-3 hover:scale-[1.03] h-full max-w-full overflow-hidden flex flex-col group cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#f9bc60]/40"
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(249,188,96,0.15) 100%)",
        boxShadow:
          "0 20px 25px -5px rgba(0, 70, 67, 0.15), 0 10px 10px -5px rgba(0, 70, 67, 0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {isRead && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#abd1c6] text-[#001e1d] text-xs font-black uppercase tracking-wide shadow-md">
          Прочитано
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-[#f9bc60]/0 via-[#f9bc60]/0 to-[#f9bc60]/0 group-hover:from-[#f9bc60]/5 group-hover:via-[#f9bc60]/10 group-hover:to-[#f9bc60]/5 transition-all duration-700 rounded-3xl pointer-events-none"></div>

      <div className="relative mb-5 rounded-t-3xl overflow-hidden flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-all duration-700">
        <div className="relative w-full h-56 overflow-hidden">
          <img
            src={mainImage}
            alt={story.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.currentTarget.src = "/stories-preview.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700"></div>

          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] group-hover:h-3 transition-all duration-700 shadow-lg shadow-[#f9bc60]/50"></div>

          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/0 group-hover:via-white/20 group-hover:to-white/0 transition-all duration-1000 opacity-0 group-hover:opacity-100"></div>

          {likesCount > 0 && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 shadow-lg group-hover:bg-black/80 group-hover:scale-110 transition-all duration-300">
              <LucideIcons.Heart
                size="xs"
                className={`${liked ? "fill-red-400" : ""} text-red-400`}
              />
              <span className="text-white text-xs font-bold">
                {likesCount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 min-w-0 px-5 sm:px-6 pb-5 sm:pb-6 relative z-10">
        <div className="mb-3">
          <h3
            className="text-lg sm:text-xl md:text-2xl font-black leading-tight line-clamp-2 break-words overflow-hidden transition-all duration-500 group-hover:text-[#004643]"
            style={{
              color: "#001e1d",
              textShadow: "0 2px 4px rgba(0,0,0,0.08)",
            }}
          >
            {renderHighlightedText(story.title, query)}
          </h3>
        </div>

        <div className="mb-4 flex-1">
          <p
            className="text-sm sm:text-base leading-relaxed line-clamp-3 break-words overflow-hidden transition-all duration-500 group-hover:text-[#2d5a4e]"
            style={{ color: "#2d5a4e" }}
          >
            {renderHighlightedText(story.summary, query)}
          </p>
        </div>

        <div className="space-y-3 flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {story.user?.id ? (
              <Link
                href={`/profile/${story.user.id}`}
                className="flex items-center gap-2 group/author bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={story.user.avatar || "/default-avatar.png"}
                    alt={authorName}
                    loading="lazy"
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#abd1c6]/60 group-hover/author:border-[#f9bc60] transition-all duration-300 shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = "/default-avatar.png";
                    }}
                  />
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-[#f9bc60]/30 to-transparent opacity-0 group-hover/author:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </div>
                <span className="text-sm font-bold text-[#001e1d] group-hover/author:text-[#004643] transition-colors duration-300 whitespace-nowrap">
                  {authorName}
                </span>
                {story.user?.heroBadge && (
                  <HeroBadge
                    badge={story.user.heroBadge}
                    size="sm"
                    className="ring-1 ring-[#001e1d]/20 shadow-md"
                  />
                )}
              </Link>
            ) : (
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 flex-shrink-0">
                <img
                  src={story.user?.avatar || "/default-avatar.png"}
                  alt={authorName}
                  loading="lazy"
                  className="w-7 h-7 rounded-full object-cover border-2 border-[#abd1c6]/60"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
                <span className="text-sm font-bold text-[#001e1d] whitespace-nowrap">
                  {authorName}
                </span>
                {story.user?.heroBadge && (
                  <HeroBadge
                    badge={story.user.heroBadge}
                    size="sm"
                    className="ring-1 ring-[#001e1d]/20 shadow-md"
                  />
                )}
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex-shrink-0">
              <LucideIcons.Clock size="sm" className="text-[#004643]" />
              <span className="text-sm font-bold text-[#001e1d]">
                {Math.ceil(story.summary.length / 200)} мин
              </span>
            </div>
            {amountText && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-[#f9bc60]/25 to-[#f9bc60]/10 backdrop-blur-sm rounded-2xl px-3 py-2 border border-[#f9bc60]/50 shadow-sm hover:shadow-md hover:border-[#f9bc60]/80 transition-all duration-300 hover:scale-[1.02] flex-shrink-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f9bc60]/30 border border-[#f9bc60]/50 shadow-inner">
                  <LucideIcons.Ruble size="xs" className="text-[#8b6b1f]" />
                </span>
                <span className="text-xs uppercase tracking-wide text-[#8b6b1f] font-semibold">
                  сумма
                </span>
                <span className="text-sm font-black text-[#001e1d]">
                  {amountText} ₽
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#abd1c6]/30 group-hover:border-[#f9bc60]/40 transition-colors duration-500">
            <button
              onClick={onLike}
              disabled={isLiking || isAuthenticated === false}
              className={`flex items-center gap-2 bg-gradient-to-r backdrop-blur-sm rounded-xl px-4 py-2.5 border transition-all duration-300 flex-shrink-0 ${
                isLiking || isAuthenticated === false
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-lg hover:scale-105 active:scale-95"
              } ${
                liked
                  ? "from-red-50/90 to-pink-50/90 border-[#e16162]/60 shadow-md shadow-red-200/30"
                  : "from-white/40 to-white/30 border-[#abd1c6]/40 hover:border-[#e16162]/60 hover:from-red-50/50 hover:to-pink-50/50"
              }`}
              title={
                isAuthenticated === false
                  ? "Войдите в систему, чтобы ставить лайки"
                  : liked
                    ? "Убрать лайк"
                    : "Поставить лайк"
              }
            >
              {isLiking ? (
                <LucideIcons.Loader2
                  size="sm"
                  className="text-[#e16162] animate-spin"
                />
              ) : (
                <LucideIcons.Heart
                  size="sm"
                  className={`transition-all duration-300 ${
                    liked
                      ? "text-[#e16162] fill-[#e16162] scale-110"
                      : "text-[#e16162] group-hover:scale-125"
                  }`}
                />
              )}
              <span className="text-sm font-bold text-[#e16162]">
                {likesCount}
              </span>
            </button>

            <div className="flex items-center gap-1.5 text-xs">
              <LucideIcons.Calendar size="xs" className="text-[#2d5a4e]/70" />
              <span
                className="font-semibold transition-colors duration-500 group-hover:text-[#004643] uppercase tracking-wide"
                style={{ color: "#2d5a4e" }}
              >
                {story.createdAt
                  ? new Date(story.createdAt).toLocaleDateString("ru-RU", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Дата неизвестна"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
