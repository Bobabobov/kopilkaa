"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { MutableRefObject } from "react";
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RankConfig } from "./rankConfig";

export interface TopStoryCardProps {
  story: StoryItem;
  rank: RankConfig;
  isRead: boolean;
  suppressCardClickRef: MutableRefObject<boolean>;
}

const darkGlassCard = cn(
  "border border-white/[0.1] bg-[#0a2321]/92 backdrop-blur-md",
  "shadow-[0_12px_40px_-14px_rgba(0,0,0,0.55)]",
  "before:pointer-events-none before:absolute before:inset-0 before:rounded-3xl before:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
);

function TopStoryCardInner({
  story,
  rank,
  isRead,
  suppressCardClickRef,
}: TopStoryCardProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const amountText = formatAmount(story.amount);
  const imageUrl = buildUploadUrl(
    story.images?.[0]?.url || "/stories-preview.jpg",
    { variant: "thumb" },
  );
  const avatarUrl = buildUploadUrl(resolveAvatarUrl(story.user?.avatar), {
    variant: "thumb",
  });
  const imageUnoptimized = isUploadUrl(imageUrl) || isExternalUrl(imageUrl);
  const avatarUnoptimized = isUploadUrl(avatarUrl) || isExternalUrl(avatarUrl);

  const authorName =
    story.user?.name || story.user?.email || "Неизвестный автор";

  const openStory = () => {
    if (suppressCardClickRef.current) {
      suppressCardClickRef.current = false;
      return;
    }
    router.push(`/stories/${story.id}`);
  };

  return (
    <div
      role="listitem"
      className="w-[min(88vw,280px)] sm:w-[min(46vw,300px)] md:w-[min(360px,32vw)] lg:w-[min(380px,31vw)] xl:w-[400px] shrink-0 snap-start"
    >
      <motion.article
        role="button"
        tabIndex={0}
        layout={false}
        initial={false}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -6,
                transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] },
              }
        }
        whileTap={reduceMotion ? undefined : { scale: 0.985 }}
        onClick={openStory}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openStory();
          }
        }}
        aria-label={`Открыть историю: ${story.title}`}
        className={cn(
          "group relative overflow-hidden rounded-3xl transition-[box-shadow,transform,border-color] duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#004643] h-full",
          darkGlassCard,
          story.isContestWinner
            ? "border-[#f9bc60]/55 ring-2 ring-[#f9bc60]/25 hover:border-[#f9bc60]/90 hover:shadow-[0_28px_64px_-18px_rgba(249,188,96,0.38),0_0_0_1px_rgba(249,188,96,0.18)]"
            : "hover:border-white/18 hover:shadow-[0_22px_56px_-20px_rgba(249,188,96,0.22),0_0_0_1px_rgba(255,255,255,0.08)]",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute left-0 top-8 bottom-8 z-[2] w-[3px] rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-300",
            rank.accentBar,
          )}
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px rounded-t-3xl bg-white/12" />

        <div className="relative h-36 sm:h-40 md:h-44 overflow-hidden rounded-t-3xl ring-1 ring-inset ring-white/[0.07] shadow-[inset_0_-20px_40px_-10px_rgba(0,30,29,0.85)]">
          <Image
            src={imageUrl}
            alt={story.title}
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1024px) 46vw, (max-width: 1536px) 32vw, 400px"
            quality={65}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            unoptimized={imageUnoptimized}
            onError={(e) => {
              e.currentTarget.src = "/stories-preview.jpg";
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[#001e1d]/88" />

          <div
            className={`absolute top-4 left-4 z-[3] inline-flex items-center justify-center rounded-xl ${rank.bg} ${rank.shadow} ring-2 ${rank.ring} px-3 py-1.5 text-sm font-bold ${rank.text} transition-transform duration-300 group-hover:scale-[1.03] shadow-md`}
          >
            {rank.label}
          </div>

          {story.isContestWinner && (
            <div className="absolute top-4 right-4 z-[3] inline-flex items-center gap-1.5 rounded-lg bg-[#001e1d]/95 backdrop-blur-sm px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f9bc60] shadow-lg ring-1 ring-[#f9bc60]/50 border border-[#f9bc60]/30">
              <LucideIcons.Trophy size="xs" className="h-3.5 w-3.5 shrink-0" />
              Победитель конкурса
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-[3] flex items-center gap-2">
            {story.user?.id ? (
              <>
                <Link
                  href={`/profile/${story.user.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors hover:text-[#f9bc60]"
                >
                  <Image
                    src={avatarUrl}
                    alt=""
                    width={32}
                    height={32}
                    quality={65}
                    className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                    unoptimized={avatarUnoptimized}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                  <span className="truncate">{authorName}</span>
                </Link>
                <UserPublicBadges markedAsDeceiver={story.user?.markedAsDeceiver} />
              </>
            ) : (
              <>
                <Image
                  src={avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  quality={65}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                  unoptimized={avatarUnoptimized}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="truncate text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {authorName}
                </span>
                <UserPublicBadges markedAsDeceiver={story.user?.markedAsDeceiver} />
              </>
            )}
          </div>

          <div className="absolute inset-0 z-[2] flex items-center justify-center bg-[#001e1d]/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bc60] px-5 py-2.5 text-sm font-bold text-[#001e1d] shadow-lg ring-2 ring-[#001e1d]/20 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
              Читать
              <LucideIcons.ArrowRight size="sm" />
            </span>
          </div>
        </div>

        <div className="relative bg-[#060f0e]/40 px-4 py-4 sm:px-5 sm:py-5 text-center">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-3xl bg-[#f9bc60]/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <h3 className="text-lg font-bold text-[#fffffe] line-clamp-2 leading-snug group-hover:text-[#f9bc60] transition-colors duration-300 text-balance">
            {story.title}
          </h3>
          <p className="text-sm text-[#abd1c6]/95 mt-2 line-clamp-2 leading-relaxed text-pretty mx-auto max-w-[28ch]">
            {story.summary}
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-5 flex-wrap">
            <Badge
              variant="secondary"
              className="gap-1.5 border-[#abd1c6]/25 bg-[#001e1d]/55 py-1.5 pl-2 pr-2.5 text-sm font-semibold text-[#abd1c6] shadow-sm transition-colors group-hover:border-[#abd1c6]/35"
            >
              <LucideIcons.Heart
                size="sm"
                className="text-[#e16162] fill-[#e16162]/55 shrink-0"
              />
              <span className="tabular-nums">{story._count?.likes ?? 0}</span>
            </Badge>

            {amountText && (
              <Badge
                variant="default"
                className="gap-1 border-[#f9bc60]/35 bg-[#f9bc60]/14 py-1.5 pl-2 pr-2.5 text-sm font-bold text-[#f9bc60] shadow-sm"
              >
                <LucideIcons.Ruble size="sm" className="shrink-0" />
                {amountText} ₽
              </Badge>
            )}

            {isRead && (
              <Badge
                variant="secondary"
                className="border-[#abd1c6]/45 bg-[#abd1c6] py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#001e1d]"
              >
                <LucideIcons.Check size="xs" className="w-3 h-3 shrink-0" />
                прочитано
              </Badge>
            )}

            <span
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f9bc60]/15 text-[#f9bc60] opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0 group-hover:translate-x-0.5 max-sm:hidden"
              aria-hidden
            >
              <LucideIcons.ArrowRight size="sm" />
            </span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export const TopStoryCard = memo(TopStoryCardInner, (prev, next) => {
  return (
    prev.story.id === next.story.id &&
    prev.isRead === next.isRead &&
    prev.rank.label === next.rank.label &&
    prev.story.title === next.story.title &&
    prev.story.summary === next.story.summary &&
    prev.story._count?.likes === next.story._count?.likes &&
    prev.story.amount === next.story.amount &&
    prev.story.isContestWinner === next.story.isContestWinner &&
    prev.story.images?.[0]?.url === next.story.images?.[0]?.url &&
    prev.story.user?.id === next.story.user?.id &&
    prev.story.user?.avatar === next.story.user?.avatar
  );
});

TopStoryCard.displayName = "TopStoryCard";
