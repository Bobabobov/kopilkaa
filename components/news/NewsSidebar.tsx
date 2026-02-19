"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import type { NewsItem } from "./types";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
      <Card variant="default" padding="md">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[#fffffe]">Сводка</h3>
            <Badge variant="muted" className="gap-1.5 text-[10px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              live
            </Badge>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="min-w-0 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/30 p-2 sm:p-3 text-center">
              <div className="text-[10px] sm:text-xs text-[#abd1c6]/70 uppercase tracking-wide break-words leading-tight">{getPostWord(stats.total)}</div>
              <div className="text-lg font-bold text-[#fffffe] mt-0.5">{stats.total}</div>
            </div>
            <div className="min-w-0 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/30 p-2 sm:p-3 text-center">
              <div className="text-[10px] sm:text-xs text-[#abd1c6]/70 uppercase tracking-wide break-words leading-tight">Лайков</div>
              <div className="text-lg font-bold text-[#10B981] mt-0.5">{stats.likes}</div>
            </div>
            <div className="min-w-0 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/30 p-2 sm:p-3 text-center">
              <div className="text-[10px] sm:text-xs text-[#abd1c6]/70 uppercase tracking-wide break-words leading-tight" title="Дизлайков">Дизл.</div>
              <div className="text-lg font-bold text-red-400 mt-0.5">{stats.dislikes}</div>
            </div>
          </div>
          {lastUpdatedAt && (
            <p className="mt-3 text-[10px] text-[#abd1c6]/60">
              Обновлено: {new Date(lastUpdatedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </CardContent>
      </Card>

      <Card variant="default" padding="md" className="mt-4">
        <CardContent className="p-0">
          <h3 className="text-base font-bold text-[#fffffe]">Топ новости</h3>
          {top.length === 0 ? (
            <p className="mt-3 text-sm text-[#abd1c6]/70">Пока нечего показывать</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {top.map((it) => (
                <li key={it.id}>
                  <Link
                    href={`/news#${it.id}`}
                    className="block rounded-xl border border-[#abd1c6]/15 bg-[#004643]/30 p-3 hover:bg-[#004643]/50 hover:border-[#abd1c6]/25 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 text-[10px] text-[#abd1c6]/70">
                      <span className="inline-flex items-center gap-1">
                        <LucideIcons.Calendar className="w-3 h-3" />
                        {formatShortDate(it.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="text-[#10B981]">{it.likesCount}</span>
                        <span className="text-red-400">{it.dislikesCount}</span>
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#fffffe] line-clamp-2">
                      {it.title || "Без заголовка"}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card variant="default" padding="md" className="mt-4">
        <CardContent className="p-0">
          <h3 className="text-base font-bold text-[#fffffe]">Полезное</h3>
          <Separator className="my-3 bg-[#abd1c6]/15" />
          <div className="space-y-2">
            <Link
              href="/support"
              className="group flex items-center gap-3 p-3 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/20 hover:bg-[#004643]/40 hover:border-[#abd1c6]/25 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#f9bc60]/15 group-hover:bg-[#f9bc60]/25">
                <LucideIcons.Heart className="w-4 h-4 text-[#f9bc60]" />
              </div>
              <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe]">Поддержать проект</span>
            </Link>
            <Link
              href="/stories"
              className="group flex items-center gap-3 p-3 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/20 hover:bg-[#004643]/40 hover:border-[#abd1c6]/25 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#abd1c6]/15 group-hover:bg-[#abd1c6]/25">
                <LucideIcons.BookOpen className="w-4 h-4 text-[#abd1c6]" />
              </div>
              <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe]">Истории</span>
            </Link>
            <Link
              href="/applications"
              className="group flex items-center gap-3 p-3 rounded-xl border border-[#abd1c6]/15 bg-[#004643]/20 hover:bg-[#004643]/40 hover:border-[#abd1c6]/25 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/10 group-hover:bg-white/15">
                <LucideIcons.FileText className="w-4 h-4 text-[#abd1c6]" />
              </div>
              <span className="text-sm font-semibold text-[#abd1c6] group-hover:text-[#fffffe]">Подать заявку</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
