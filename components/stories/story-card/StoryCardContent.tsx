import Link from "next/link";
import Image from "next/image";
import { LucideIcons } from "@/components/ui/LucideIcons";
import LikeButton from "@/components/stories/LikeButton";
import { renderHighlightedText } from "./highlight";
import type { Story } from "./types";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";

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
  onLike: (event?: React.MouseEvent) => void;
}

const buildPreviewUrl = (url: string) =>
  buildUploadUrl(url, { variant: "thumb" });

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
  const previewImage = buildPreviewUrl(mainImage);
  const shouldBypassOptimization =
    isUploadUrl(previewImage) || isExternalUrl(previewImage);

  const isWinner = story.isContestWinner;

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Открыть историю: ${story.title}`}
      onClick={onCardClick}
      onKeyDown={onCardKeyDown}
      className={`relative backdrop-blur-2xl rounded-3xl p-0 shadow-2xl transition-all duration-500 h-full max-w-full overflow-hidden flex flex-col group cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:-translate-y-2 ${
        isWinner
          ? "border-2 border-[#f9bc60] ring-2 ring-[#f9bc60]/40 hover:border-[#e8a545] hover:ring-[#f9bc60]/60 hover:shadow-[0_20px_50px_-12px_rgba(249,188,96,0.4),0_0_0_1px_rgba(249,188,96,0.2)]"
          : "border border-[#abd1c6]/50 hover:border-[#f9bc60]/80 hover:shadow-[0_24px_56px_-16px_rgba(249,188,96,0.22),0_0_0_1px_rgba(249,188,96,0.08)]"
      } ${!isWinner ? "bg-gradient-to-br from-white/98 via-white/95 to-white/90" : ""}`}
      style={
        isWinner
          ? {
              background:
                "linear-gradient(145deg, rgba(255,251,235,0.99) 0%, rgba(255,246,220,0.97) 35%, rgba(249,188,96,0.22) 100%)",
              boxShadow:
                "0 24px 48px -16px rgba(249,188,96,0.35), 0 0 0 2px rgba(249,188,96,0.2), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(249,188,96,0.1)",
            }
          : {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(249,188,96,0.12) 100%)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 70, 67, 0.12), 0 10px 10px -5px rgba(0, 70, 67, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
            }
      }
    >
      {isWinner && (
        <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl overflow-hidden opacity-60">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(249,188,96,0.15),transparent)]" />
        </div>
      )}
      {/* Лёгкий блик по верхнему краю карточки */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-px rounded-t-3xl ${
          isWinner
            ? "bg-gradient-to-r from-transparent via-[#f9bc60]/70 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#abd1c6]/40 to-transparent"
        }`}
      />

      {isWinner && (
        <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#001e1d] shadow-[0_4px_14px_rgba(249,188,96,0.45)] ring-2 ring-[#001e1d]/20 border border-[#fff]/30">
          <LucideIcons.Trophy size="sm" className="w-4 h-4 shrink-0" />
          <span>Победитель конкурса</span>
        </div>
      )}

      {isRead && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#abd1c6] text-[#001e1d] text-xs font-bold uppercase tracking-wide shadow-md border border-[#94a1b2]/30">
          <LucideIcons.Check size="xs" className="w-3.5 h-3.5 shrink-0" />
          Прочитано
        </div>
      )}

      <div
        className={`absolute inset-0 transition-all duration-500 rounded-3xl pointer-events-none ${
          isWinner
            ? "bg-gradient-to-br from-[#f9bc60]/5 via-[#f9bc60]/10 to-[#f9bc60]/5 group-hover:from-[#f9bc60]/10 group-hover:via-[#f9bc60]/15 group-hover:to-[#f9bc60]/10"
            : "bg-gradient-to-br from-[#f9bc60]/0 via-[#f9bc60]/0 to-[#f9bc60]/0 group-hover:from-[#f9bc60]/5 group-hover:via-[#f9bc60]/10 group-hover:to-[#f9bc60]/5"
        }`}
      />

      <div className="relative mb-5 rounded-t-3xl overflow-hidden flex-shrink-0 shadow-xl group-hover:shadow-2xl transition-all duration-500">
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={previewImage}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            unoptimized={shouldBypassOptimization}
            onError={(e) => {
              e.currentTarget.src = "/stories-preview.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 group-hover:via-black/10 transition-all duration-700"></div>

          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] transition-all duration-700 shadow-lg shadow-[#f9bc60]/50 ${
              isWinner ? "h-2.5 group-hover:h-3.5" : "h-2 group-hover:h-3"
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/0 group-hover:via-white/20 group-hover:to-white/0 transition-all duration-1000 opacity-0 group-hover:opacity-100 pointer-events-none"></div>

          {/* CTA при наведении */}
          <div className="absolute inset-0 flex items-center justify-center bg-[#001e1d]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bc60] px-5 py-2.5 text-sm font-bold text-[#001e1d] shadow-lg ring-2 ring-[#001e1d]/15">
              Читать
              <LucideIcons.ArrowRight size="sm" />
            </span>
          </div>

          {likesCount > 0 && (
            <div
              className={`absolute flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20 shadow-lg group-hover:bg-black/80 group-hover:scale-110 transition-all duration-300 ${
                isWinner ? "top-16 right-4" : "top-4 right-4"
              }`}
            >
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
              </div>
            )}

            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#abd1c6]/40 hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 transition-all duration-300 hover:shadow-md hover:scale-[1.02] flex-shrink-0">
              <LucideIcons.Clock size="sm" className="text-[#004643]" />
              <span className="text-sm font-bold text-[#001e1d]">
                {Math.ceil(story.summary.length / 200)} мин
              </span>
            </div>
            {amountText && (
              isWinner ? (
                <div className="flex-shrink-0 rounded-2xl overflow-hidden border border-[#e8a545]/50 bg-gradient-to-b from-[#fffbf0] to-[#fef5e0] shadow-[0_2px_12px_rgba(249,188,96,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(249,188,96,0.28)] hover:scale-[1.02] hover:border-[#f9bc60]/70">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-[0_2px_8px_rgba(232,165,69,0.4)]">
                      <LucideIcons.Trophy size="sm" className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6b5344]">
                        Приз конкурса
                      </span>
                      <span className="mt-0.5 text-xl font-extrabold tabular-nums tracking-tight text-[#001e1d] leading-none">
                        {amountText} ₽
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2 border border-[#f9bc60]/50 bg-gradient-to-r from-[#f9bc60]/25 to-[#f9bc60]/10 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#f9bc60]/80 hover:scale-[1.02] flex-shrink-0">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#f9bc60]/30 border border-[#f9bc60]/50 shadow-inner">
                    <LucideIcons.Ruble size="xs" className="text-[#8b6b1f]" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#8b6b1f]">
                    сумма
                  </span>
                  <span className="text-sm font-black tabular-nums text-[#001e1d]">
                    {amountText} ₽
                  </span>
                </div>
              )
            )}
          </div>

          {isWinner && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5 rounded-b-3xl bg-gradient-to-r from-[#f9bc60]/80 via-[#e8a545] to-[#f9bc60]/80 z-10" />
          )}

          <div className={`flex items-center justify-between gap-3 pt-2 border-t transition-colors duration-500 ${isWinner ? "border-[#f9bc60]/40 group-hover:border-[#e8a545]/60" : "border-[#abd1c6]/30 group-hover:border-[#f9bc60]/40"}`}>
            <LikeButton
              liked={liked}
              likesCount={likesCount}
              onLike={onLike}
              isAuthenticated={isAuthenticated}
              isLiking={isLiking}
              variant="light"
            />

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
    </article>
  );
}
