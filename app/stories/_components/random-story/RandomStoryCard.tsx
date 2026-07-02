"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { formatAmount } from "@/lib/format";
import { buildUploadUrl, isExternalUrl, isUploadUrl } from "@/lib/uploads/url";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { storiesGlassCard } from "../stories-ui/glassStyles";
import {
  STORY_REACTION_TYPES,
  type StoryReactionType,
} from "@/lib/stories/reactions";
import { StoryReactionIcon } from "@/components/stories/StoryReactionIcon";

export interface RandomStoryCardProps {
  story: StoryItem;
  isRead: boolean;
}

function RandomStoryCardInner({ story, isRead }: RandomStoryCardProps) {
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
  const activeReactions = STORY_REACTION_TYPES.filter(
    (type) => (story.reactionCounts?.[type] ?? 0) > 0,
  );

  const openStory = () => {
    router.push(`/stories/${story.id}`);
  };

  return (
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
        storiesGlassCard,
        "group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#004643]",
        "hover:-translate-y-0.5 hover:border-white/20",
      )}
    >
      <div
        className="pointer-events-none absolute left-0 top-8 bottom-8 z-[2] w-[3px] rounded-full bg-[#abd1c6]/70 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px rounded-t-2xl bg-white/12" />

      <div className="relative h-32 overflow-hidden rounded-t-2xl ring-1 ring-inset ring-white/[0.07] shadow-[inset_0_-20px_40px_-10px_rgba(0,30,29,0.85)]">
        <Image
          src={imageUrl}
          alt={story.title}
          fill
          sizes="(max-width: 640px) 88vw, 384px"
          quality={65}
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          unoptimized={imageUnoptimized}
          onError={(e) => {
            e.currentTarget.src = "/stories-preview.jpg";
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[#001e1d]/88" />

        <div className="absolute bottom-2 left-2 right-2 z-[3] flex items-center gap-1.5">
          {story.user?.id ? (
            <>
              <Link
                href={`/profile/${story.user.id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex min-w-0 items-center gap-1.5 truncate text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors hover:text-[#f9bc60]"
              >
                <Image
                  src={avatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  quality={65}
                  className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                  unoptimized={avatarUnoptimized}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_AVATAR;
                  }}
                />
                <span className="truncate">{authorName}</span>
              </Link>
            </>
          ) : (
            <>
              <Image
                src={avatarUrl}
                alt=""
                width={32}
                height={32}
                quality={65}
                className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-[#001e1d]/90"
                unoptimized={avatarUnoptimized}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <span className="truncate text-xs font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {authorName}
              </span>
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

      <div className="relative bg-[#060f0e]/40 px-3 py-3 text-center">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px rounded-b-2xl bg-[#f9bc60]/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <h3 className="text-sm font-bold text-[#fffffe] line-clamp-2 leading-snug group-hover:text-[#f9bc60] transition-colors duration-300 text-balance">
          {story.title}
        </h3>
        <p className="text-xs text-[#abd1c6]/95 mt-1 line-clamp-2 leading-relaxed text-pretty">
          {story.summary}
        </p>

        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          <Badge
            variant="secondary"
            className="gap-1 border-[#abd1c6]/25 bg-[#001e1d]/55 py-1 pl-2 pr-2 text-xs font-semibold text-[#abd1c6] shadow-sm transition-colors group-hover:border-[#abd1c6]/35"
          >
            <span className="flex items-center gap-0.5" aria-hidden>
              {(activeReactions.length > 0
                ? activeReactions
                : (["HEART"] as StoryReactionType[])
              ).map((type) => (
                <StoryReactionIcon
                  key={type}
                  type={type}
                  size="xs"
                  className={
                    activeReactions.length === 0 ? "opacity-50" : undefined
                  }
                />
              ))}
            </span>
            <span className="tabular-nums">{story._count?.likes ?? 0}</span>
          </Badge>

          {amountText && (
            <Badge
              variant="default"
              className="gap-1 border-[#f9bc60]/35 bg-[#f9bc60]/14 py-1 pl-2 pr-2 text-xs font-bold text-[#f9bc60] shadow-sm"
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

        </div>
      </div>
    </motion.article>
  );
}

export const RandomStoryCard = memo(RandomStoryCardInner, (prev, next) => {
  return (
    prev.story.id === next.story.id &&
    prev.isRead === next.isRead &&
    prev.story.title === next.story.title &&
    prev.story.summary === next.story.summary &&
    prev.story._count?.likes === next.story._count?.likes &&
    prev.story.amount === next.story.amount &&
    prev.story.images?.[0]?.url === next.story.images?.[0]?.url &&
    prev.story.user?.id === next.story.user?.id &&
    prev.story.user?.avatar === next.story.user?.avatar
  );
});

RandomStoryCard.displayName = "RandomStoryCard";
