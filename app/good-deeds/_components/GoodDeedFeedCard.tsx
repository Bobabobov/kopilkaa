"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Gift } from "lucide-react";
import { StoryAdGallery } from "@/app/good-deeds/_components/StoryAdGallery";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import type { GoodDeedsResponse } from "../types";
import { goodDeedsGlassCard } from "./good-deeds-ui/glassStyles";

export type FeedCardItem = GoodDeedsResponse["feed"][number];

function previewSummary(item: FeedCardItem): string {
  const s = item.storyText.trim();
  if (s.length > 0) return s;
  return item.taskDescription;
}

function GoodDeedFeedCardInner({
  item,
  index,
}: {
  item: FeedCardItem;
  index: number;
}) {
  const router = useRouter();
  const href = `/good-deeds/deed/${item.id}`;
  const summary = previewSummary(item);

  const handleCardClick = useCallback(() => {
    router.push(href);
  }, [href, router]);

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        router.push(href);
      }
    },
    [href, router],
  );

  const authorName = item.user.name || item.user.username || "Участник";
  const safeAuthorAvatar = resolveAvatarUrl(item.user.avatar);

  const galleryItems = item.media.map((m, i) => ({
    url: m.url,
    sort: i,
    type: m.type,
  }));

  const mainImage =
    item.media[0]?.url != null
      ? buildUploadUrl(item.media[0].url, { variant: "thumb" })
      : "/stories-preview.jpg";
  const previewFallback = mainImage;
  const fallbackUnopt =
    isUploadUrl(previewFallback) || isExternalUrl(previewFallback);

  return (
    <motion.li
      layout={false}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.06, 0.36),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group h-full max-w-full list-none"
    >
      <article
        role="button"
        tabIndex={0}
        aria-label={`Открыть отчёт: ${item.taskTitle}`}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        className={cn(
          goodDeedsGlassCard,
          "flex h-full cursor-pointer flex-col overflow-hidden",
          "hover:-translate-y-1 hover:border-[#f9bc60]/35 hover:shadow-[0_20px_48px_-16px_rgba(249,188,96,0.2)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d]",
        )}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {galleryItems.length > 0 ? (
            <StoryAdGallery
              mode="feed"
              items={galleryItems}
              title={item.taskTitle}
            />
          ) : (
            <Image
              src={previewFallback}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized={fallbackUnopt}
              onError={(e) => {
                e.currentTarget.src = "/stories-preview.jpg";
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#001e1d]/90 via-[#001e1d]/20 to-transparent" />

          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f9bc60]/40 bg-[#001e1d]/70 px-2.5 py-1 text-xs font-bold text-[#f9bc60] backdrop-blur-md">
              <Gift className="h-3.5 w-3.5" />
              +{item.reward}
            </span>
          </div>

          <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#f9bc60] px-3 py-1.5 text-xs font-bold text-[#001e1d]">
              Читать
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-[#fffffe] transition-colors group-hover:text-[#f9bc60] sm:text-lg">
            {item.taskTitle}
          </h3>

          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#abd1c6]/85">
            {summary}
          </p>

          <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
            <Link
              href={`/profile/${item.user.id}`}
              onClick={(e) => e.stopPropagation()}
              className="group/author flex min-w-0 items-center gap-2"
            >
              <img
                src={safeAuthorAvatar}
                alt=""
                loading="lazy"
                className="h-7 w-7 shrink-0 rounded-full border border-white/15 object-cover"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <span className="truncate text-sm font-medium text-[#abd1c6] transition-colors group-hover/author:text-[#fffffe]">
                {authorName}
              </span>
            </Link>
          </div>

          <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-[#94a1b2]">
            {new Date(item.updatedAt).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </article>
    </motion.li>
  );
}

export const GoodDeedFeedCard = memo(
  GoodDeedFeedCardInner,
  (prev, next) =>
    prev.item.id === next.item.id &&
    prev.item.taskTitle === next.item.taskTitle &&
    prev.item.storyText === next.item.storyText &&
    prev.item.taskDescription === next.item.taskDescription &&
    prev.item.reward === next.item.reward &&
    prev.item.updatedAt === next.item.updatedAt &&
    prev.item.media?.length === next.item.media?.length &&
    prev.item.media?.[0]?.url === next.item.media?.[0]?.url &&
    prev.item.media?.[0]?.type === next.item.media?.[0]?.type &&
    prev.item.user?.id === next.item.user?.id &&
    prev.item.user?.avatar === next.item.user?.avatar,
);

GoodDeedFeedCard.displayName = "GoodDeedFeedCard";
