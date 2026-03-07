"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NewsItem } from "./types";
import { NewsMediaGallery } from "./NewsMediaGallery";
import { NewsReactions } from "./NewsReactions";
import Link from "next/link";
import { formatDateTimeShort } from "@/lib/time";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Функция для подсчета текста без HTML тегов
function getTextLength(html: string): number {
  if (!html) return 0;
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").length;
}

/** Примерное время чтения в минутах (~200 слов/мин) */
function getReadingMinutes(charCount: number): number {
  const words = charCount / 5;
  return Math.max(1, Math.ceil(words / 200));
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface NewsPostCardProps {
  item: NewsItem;
  /** Выделенная карточка (первая новость дня): крупнее, с превью сверху */
  featured?: boolean;
}

export function NewsPostCard({ item, featured = false }: NewsPostCardProps) {
  const authorName = item.author?.name || "Администратор";
  const created = useMemo(
    () => formatDateTimeShort(item.createdAt),
    [item.createdAt],
  );
  const isOfficial = (item.author?.role || "").toUpperCase() === "ADMIN";
  const [expanded, setExpanded] = useState(false);
  const textLength = useMemo(() => getTextLength(item.content), [item.content]);
  const isLong = textLength > 520;
  const readingMin = useMemo(() => getReadingMinutes(textLength), [textLength]);
  const firstImage = useMemo(
    () => item.media?.find((m) => m.type === "IMAGE")?.url,
    [item.media],
  );
  const showFeaturedImage = featured && firstImage;

  const handleShare = async () => {
    const url = `${window.location.origin}/news#${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title || "Новость проекта",
          text: item.title || "",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        // Можно добавить toast уведомление, но пока просто копируем
      }
    } catch (err) {
      // Пользователь отменил шаринг или произошла ошибка
      if (err instanceof Error && err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(url);
        } catch (clipboardErr) {
          console.error("Failed to copy to clipboard", clipboardErr);
        }
      }
    }
  };

  return (
    <motion.article
      id={item.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="scroll-mt-24"
    >
      <style jsx global>{`
        .prose h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #fffffe;
        }
        .prose p {
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 254, 0.9);
        }
        .prose ul,
        .prose ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .prose ul {
          list-style-type: disc;
        }
        .prose ol {
          list-style-type: decimal;
        }
        .prose li {
          margin-bottom: 0.25rem;
        }
        .prose strong {
          font-weight: bold;
          color: #fffffe;
        }
        .prose em {
          font-style: italic;
        }
        .prose u {
          text-decoration: underline;
        }
        .prose [style*="text-align: left"] {
          text-align: left;
        }
        .prose [style*="text-align: center"] {
          text-align: center;
        }
        .prose [style*="text-align: right"] {
          text-align: right;
        }
        .prose a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .prose a:hover {
          color: #60a5fa;
        }
      `}</style>
      <Card
        variant="darkGlass"
        padding="none"
        hoverable
        className={cn(
          "overflow-hidden",
          featured && "ring-1 ring-[#f9bc60]/30 shadow-lg",
        )}
      >
        {showFeaturedImage && (
          <div className="relative w-full aspect-video overflow-hidden bg-[#001e1d]">
            <img
              src={firstImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001e1d]/80 via-transparent to-transparent" />
          </div>
        )}
        <CardContent className={cn("p-5 sm:p-6 relative", featured && "sm:p-7")}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f9bc60]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#abd1c6]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {isOfficial && (
                    <Badge variant="default" className="gap-1.5 text-[10px] font-bold px-2 py-0">
                      <LucideIcons.Shield className="w-3 h-3" />
                      Официально
                    </Badge>
                  )}
                  {featured && (
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      Главная
                    </Badge>
                  )}
                  {item.title && (
                    <h2
                      className={cn(
                        "font-black text-[#fffffe] leading-snug mt-0.5",
                        featured ? "text-xl sm:text-3xl md:text-4xl" : "text-lg sm:text-2xl",
                      )}
                    >
                      {item.title}
                    </h2>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#abd1c6]/80">
              <span className="inline-flex items-center gap-2 min-w-0">
                <Avatar className="h-6 w-6 border border-[#abd1c6]/20 ring-1 ring-[#001e1d]/50">
                  <AvatarImage src={item.author?.avatar || "/default-avatar.png"} alt={authorName} />
                  <AvatarFallback className="bg-[#004643] text-[#abd1c6] text-[10px]">
                    {getInitials(authorName)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-[#abd1c6] truncate max-w-[200px]">
                  {authorName}
                </span>
              </span>
              <span aria-hidden className="text-[#abd1c6]/40">·</span>
              <time dateTime={item.createdAt} className="whitespace-nowrap">{created}</time>
              <span aria-hidden className="text-[#abd1c6]/40">·</span>
              <span className="inline-flex items-center gap-1 text-[#abd1c6]/70 whitespace-nowrap">
                <LucideIcons.Clock className="w-3 h-3" />
                {readingMin} мин
              </span>
              <span aria-hidden className="text-[#abd1c6]/40">·</span>
              <Link
                href="/support"
                className="text-[#abd1c6] hover:text-[#fffffe] underline-offset-2 hover:underline"
              >
                Поддержать
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div
            className={`relative text-sm sm:text-base leading-relaxed text-white/90 prose prose-sm prose-invert max-w-none ${
              !expanded && isLong ? "line-clamp-6" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
          {!expanded && isLong && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#f9bc60] hover:text-[#fffffe] transition"
              >
                Читать далее
                <LucideIcons.ChevronDown size="sm" />
              </button>
            </div>
          )}
          {expanded && isLong && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center gap-2 text-sm font-bold text-white/75 hover:text-[#fffffe] transition"
              >
                Свернуть
                <LucideIcons.ChevronUp size="sm" />
              </button>
            </div>
          )}
        </div>

        <NewsMediaGallery media={item.media} />

        <NewsReactions
          postId={item.id}
          initialLikes={item.likesCount}
          initialDislikes={item.dislikesCount}
          initialMyReaction={item.myReaction}
        />

        <Separator className="my-4 bg-[#abd1c6]/15" />

        <CardFooter className="p-0 border-0">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#abd1c6]/80 hover:text-[#f9bc60] transition-colors"
          >
            <LucideIcons.Share size="xs" />
            Поделиться
          </button>
        </CardFooter>
          </div>
        </CardContent>
      </Card>
    </motion.article>
  );
}
