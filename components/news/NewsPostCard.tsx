"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NewsItem } from "./types";
import { NewsMediaGallery } from "./NewsMediaGallery";
import { NewsReactions } from "./NewsReactions";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Функция для подсчета текста без HTML тегов
function getTextLength(html: string): number {
  if (!html) return 0;
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").length;
}

export function NewsPostCard({ item }: { item: NewsItem }) {
  const authorName = item.author?.name || "Администратор";
  const created = useMemo(() => formatDate(item.createdAt), [item.createdAt]);
  const isOfficial = (item.author?.role || "").toUpperCase() === "ADMIN";
  const [expanded, setExpanded] = useState(false);
  const textLength = useMemo(() => getTextLength(item.content), [item.content]);
  const isLong = textLength > 520;

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/25 bg-gradient-to-br from-[#004643]/55 to-[#001e1d]/40 shadow-xl scroll-mt-24 mb-6"
    >
      {/* декор */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f9bc60]/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-[#abd1c6]/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {isOfficial && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9bc60]/15 border border-[#f9bc60]/30 text-[11px] font-black text-[#f9bc60]">
                  <LucideIcons.Shield size="xs" />
                  Официально
                </span>
              )}
              {item.badge && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    item.badge === "UPDATE"
                      ? "bg-blue-500/20 border border-blue-400/40 text-blue-300"
                      : item.badge === "PLANS"
                        ? "bg-green-500/20 border border-green-400/40 text-green-300"
                        : item.badge === "THOUGHTS"
                          ? "bg-purple-500/20 border border-purple-400/40 text-purple-300"
                          : item.badge === "IMPORTANT"
                            ? "bg-orange-500/20 border border-orange-400/40 text-orange-300"
                            : "bg-white/8 border border-white/15 text-white/75"
                  }`}
                >
                  {item.badge === "UPDATE" && "Обновление"}
                  {item.badge === "PLANS" && "Планы"}
                  {item.badge === "THOUGHTS" && "Мысли"}
                  {item.badge === "IMPORTANT" && "Важно"}
                </span>
              )}
              {item.title && (
                <h2 className="text-lg sm:text-2xl font-black text-[#fffffe] leading-snug">
                  {item.title}
                </h2>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-2">
                <img
                  src={item.author?.avatar || "/default-avatar.png"}
                  alt={`Аватар ${authorName}`}
                  className="w-6 h-6 rounded-full object-cover border border-white/15"
                  onError={(e) => {
                    e.currentTarget.src = "/default-avatar.png";
                  }}
                />
                <span className="font-semibold text-white/80 truncate max-w-[220px]">
                  {authorName}
                </span>
              </span>
              <span className="text-[#f9bc60]">•</span>
              <span>{created}</span>
              <span className="text-[#f9bc60]">•</span>
              <Link
                href="/support"
                className="text-[#abd1c6] hover:text-[#fffffe] underline-offset-2 hover:underline"
              >
                Поддержать проект
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

        {/* Разделитель и кнопка "Поделиться" */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white/90 transition-colors"
          >
            <LucideIcons.Share size="xs" />
            Поделиться
          </button>
        </div>
      </div>
    </motion.article>
  );
}
