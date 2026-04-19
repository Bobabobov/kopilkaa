"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { StoryAdGallery } from "@/app/good-deeds/_components/StoryAdGallery";
import { buildUploadUrl, isUploadUrl, isExternalUrl } from "@/lib/uploads/url";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import type { GoodDeedsResponse } from "../types";

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

  const authorName =
    item.user.name || item.user.username || "Участник";
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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.5),
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
        className="relative flex h-full max-w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#abd1c6]/50 bg-gradient-to-br from-white/98 via-white/95 to-white/90 p-0 shadow-2xl backdrop-blur-2xl transition-all duration-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:-translate-y-2 hover:border-[#f9bc60]/80 hover:shadow-[0_24px_56px_-16px_rgba(249,188,96,0.22),0_0_0_1px_rgba(249,188,96,0.08)]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 50%, rgba(249,188,96,0.12) 100%)",
          boxShadow:
            "0 20px 25px -5px rgba(0, 70, 67, 0.12), 0 10px 10px -5px rgba(0, 70, 67, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-[#abd1c6]/40 to-transparent" />

      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-[#f9bc60]/0 via-[#f9bc60]/0 to-[#f9bc60]/0 transition-all duration-500 group-hover:from-[#f9bc60]/5 group-hover:via-[#f9bc60]/10 group-hover:to-[#f9bc60]/5" />

      <div className="relative mb-5 flex-shrink-0 overflow-hidden rounded-t-3xl shadow-xl transition-all duration-500 group-hover:shadow-2xl">
        <div className="relative h-56 w-full overflow-hidden">
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              unoptimized={fallbackUnopt}
              onError={(e) => {
                e.currentTarget.src = "/stories-preview.jpg";
              }}
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-700 group-hover:from-black/40 group-hover:via-black/10" />

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#f9bc60] via-[#e8a545] to-[#f9bc60] shadow-lg shadow-[#f9bc60]/50 transition-all duration-700 group-hover:h-3" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 transition-all duration-1000 group-hover:from-white/0 group-hover:via-white/20 group-hover:to-white/0 group-hover:opacity-100" />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#001e1d]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#f9bc60] px-5 py-2.5 text-sm font-bold text-[#001e1d] shadow-lg ring-2 ring-[#001e1d]/15">
              Читать
              <LucideIcons.ArrowRight size="sm" />
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-w-0 flex-col flex-1 px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="mb-3">
          <h3
            className="line-clamp-2 overflow-hidden break-words text-lg font-black leading-tight transition-all duration-500 group-hover:text-[#004643] sm:text-xl md:text-2xl"
            style={{
              color: "#001e1d",
              textShadow: "0 2px 4px rgba(0,0,0,0.08)",
            }}
          >
            {item.taskTitle}
          </h3>
        </div>

        <div className="mb-4 flex-1">
          <p
            className="line-clamp-3 overflow-hidden break-words text-sm leading-relaxed transition-all duration-500 group-hover:text-[#2d5a4e] sm:text-base"
            style={{ color: "#2d5a4e" }}
          >
            {summary}
          </p>
        </div>

        <div className="flex flex-shrink-0 flex-col space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/profile/${item.user.id}`}
              onClick={(e) => e.stopPropagation()}
              className="group/author flex flex-shrink-0 items-center gap-2 rounded-xl border border-[#abd1c6]/40 bg-gradient-to-r from-[#abd1c6]/20 to-[#94c4b8]/20 px-3 py-2 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#f9bc60]/60 hover:from-[#abd1c6]/30 hover:to-[#94c4b8]/30 hover:shadow-md"
            >
                <div className="relative flex-shrink-0">
                  <img
                    src={safeAuthorAvatar}
                    alt=""
                    loading="lazy"
                    className="h-7 w-7 rounded-full border-2 border-[#abd1c6]/60 object-cover shadow-sm transition-all duration-300 group-hover/author:border-[#f9bc60]"
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <span className="whitespace-nowrap text-sm font-bold text-[#001e1d] transition-colors duration-300 group-hover/author:text-[#004643]">
                  {authorName}
                </span>
            </Link>

            <div className="flex flex-shrink-0 items-center gap-2 rounded-2xl border border-[#f9bc60]/50 bg-gradient-to-r from-[#f9bc60]/25 to-[#f9bc60]/10 px-3 py-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[#f9bc60]/80 hover:shadow-md">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#f9bc60]/50 bg-[#f9bc60]/30 shadow-inner">
                <LucideIcons.Gift size="xs" className="text-[#8b6b1f]" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-[#8b6b1f]">
                бонусы
              </span>
              <span className="text-sm font-black tabular-nums text-[#001e1d]">
                +{item.reward}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5 border-t border-[#abd1c6]/30 pt-2 text-xs transition-colors duration-500 group-hover:border-[#f9bc60]/40">
            <LucideIcons.Calendar size="xs" className="text-[#2d5a4e]/70" />
            <span
              className="font-semibold uppercase tracking-wide transition-colors duration-500 group-hover:text-[#004643]"
              style={{ color: "#2d5a4e" }}
            >
              {new Date(item.updatedAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
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
