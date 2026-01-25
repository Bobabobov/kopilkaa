"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { NewsItem } from "./types";
import { useMemo } from "react";

function formatShortDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

function getPostWord(count: number): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "постов";
  }

  if (lastDigit === 1) {
    return "пост";
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return "поста";
  }

  return "постов";
}

export function NewsSidebar({
  items,
  lastUpdatedAt,
  variant = "desktop",
}: {
  items: NewsItem[];
  lastUpdatedAt: string | null;
  variant?: "desktop" | "mobile";
}) {
  const stats = useMemo(() => {
    const total = items.length;
    const reactions = items.reduce(
      (acc, it) => {
        acc.likes += it.likesCount || 0;
        acc.dislikes += it.dislikesCount || 0;
        return acc;
      },
      { likes: 0, dislikes: 0 },
    );
    return { total, ...reactions };
  }, [items]);

  const top = useMemo(() => {
    const scored = [...items].map((it) => ({
      it,
      score: (it.likesCount || 0) - (it.dislikesCount || 0),
    }));
    scored.sort(
      (a, b) =>
        b.score - a.score ||
        +new Date(b.it.createdAt) - +new Date(a.it.createdAt),
    );
    return scored.slice(0, 5).map((x) => x.it);
  }, [items]);

  const containerClass =
    variant === "desktop" ? "sticky top-24 space-y-4" : "space-y-4";

  return (
    <div className={containerClass}>
      <div className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/35 p-5">
        <div className="flex items-center justify-between">
          <div className="text-[#fffffe] font-black text-lg">Сводка</div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/10 text-xs font-bold text-white/75">
            <LucideIcons.Activity size="xs" />
            live
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">
              {getPostWord(stats.total)}
            </div>
            <div className="text-xl font-black text-[#fffffe]">
              {stats.total}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Лайков</div>
            <div className="text-xl font-black text-[#10B981]">
              {stats.likes}
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs text-white/60">Дизлайков</div>
            <div className="text-xl font-black text-red-300">
              {stats.dislikes}
            </div>
          </div>
        </div>
        {lastUpdatedAt && (
          <div className="mt-3 text-xs text-white/55">
            Обновлено:{" "}
            <span className="text-white/75">
              {new Date(lastUpdatedAt).toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/35 p-5">
        <div className="text-[#fffffe] font-black text-lg">Топ новости</div>
        <div className="mt-3 space-y-2">
          {top.length === 0 ? (
            <div className="text-sm text-[#abd1c6]">Пока нечего показывать</div>
          ) : (
            top.map((it) => (
              <Link
                key={it.id}
                href={`/news#${it.id}`}
                className="block rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="text-xs text-white/55 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1">
                    <LucideIcons.Calendar size="xs" className="text-white/55" />
                    {formatShortDate(it.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[#10B981]">
                      <LucideIcons.ThumbsUp size="xs" /> {it.likesCount}
                    </span>
                    <span className="inline-flex items-center gap-1 text-red-300">
                      <LucideIcons.ThumbsDown size="xs" /> {it.dislikesCount}
                    </span>
                  </span>
                </div>
                <div className="mt-1 text-sm font-bold text-[#fffffe] line-clamp-2">
                  {it.title || "Без заголовка"}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-[#abd1c6]/20 bg-[#001e1d]/35 p-5">
        <div className="text-[#fffffe] font-black text-lg">Полезное</div>
        <div className="mt-3 space-y-2">
          <Link
            href="/support"
            className="group flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 flex-shrink-0 bg-[#f9bc60]/15 group-hover:bg-[#f9bc60]/25">
              <LucideIcons.Heart size="sm" className="text-[#f9bc60]" />
            </div>
            <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe] transition-colors duration-200 flex-1">
              Поддержать проект
            </span>
          </Link>
          <Link
            href="/stories"
            className="group flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 flex-shrink-0 bg-[#abd1c6]/15 group-hover:bg-[#abd1c6]/25">
              <LucideIcons.BookOpen size="sm" className="text-[#abd1c6]" />
            </div>
            <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe] transition-colors duration-200 flex-1">
              Истории
            </span>
          </Link>
          <Link
            href="/applications"
            className="group flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 flex-shrink-0 bg-white/10 group-hover:bg-white/15">
              <LucideIcons.FileText size="sm" className="text-white/80" />
            </div>
            <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe] transition-colors duration-200 flex-1">
              Подать заявку
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
