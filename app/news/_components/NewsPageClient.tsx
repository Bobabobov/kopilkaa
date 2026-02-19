"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NewsItem } from "@/components/news/types";
import { NewsPostCard } from "@/components/news/NewsPostCard";
import { LucideIcons } from "@/components/ui/LucideIcons";
import {
  NewsControlsBar,
  type NewsSort,
} from "@/components/news/NewsControlsBar";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { NewsFeedSkeleton } from "@/components/news/NewsFeedSkeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type ApiResponse = { items: NewsItem[]; nextCursor: string | null };

function getDayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(d: Date) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfThat.getTime()) / (24 * 60 * 60 * 1000),
  );
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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

export default function NewsPageClient({
  initialItems = [],
  initialNextCursor = null,
  initialLastUpdatedAt = null,
}: {
  initialItems?: NewsItem[];
  initialNextCursor?: string | null;
  initialLastUpdatedAt?: string | null;
}) {
  const [items, setItems] = useState<NewsItem[]>(() => initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(
    () => initialNextCursor,
  );
  const [loading, setLoading] = useState(() => initialItems.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<NewsSort>("new");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(
    initialLastUpdatedAt,
  );

  const fetchPage = useCallback(async (cursor?: string | null) => {
    const url = new URL("/api/news", window.location.origin);
    url.searchParams.set("limit", "10");
    if (cursor) url.searchParams.set("cursor", cursor);

    const r = await fetch(url.toString(), { cache: "no-store" });
    const d = (await r.json().catch(() => null)) as ApiResponse | null;
    if (!r.ok) {
      throw new Error((d as any)?.error || "Ошибка загрузки");
    }
    return d!;
  }, []);

  const load = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const d = await fetchPage(null);
      setItems(d.items || []);
      setNextCursor(d.nextCursor ?? null);
      setLastUpdatedAt(new Date().toISOString());
    } catch (e: any) {
      setError(e?.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const d = await fetchPage(nextCursor);
      setItems((prev) => [...prev, ...(d.items || [])]);
      setNextCursor(d.nextCursor ?? null);
    } catch {
      // тихо — кнопка исчезнет только если cursor null
    } finally {
      setLoadingMore(false);
    }
  }, [fetchPage, nextCursor, loadingMore]);

  useEffect(() => {
    if (initialItems.length > 0) return;
    load();
  }, [load, initialItems.length]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = `${it.title || ""}\n${it.content || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "top") {
      list.sort(
        (a, b) =>
          b.likesCount - b.dislikesCount - (a.likesCount - a.dislikesCount) ||
          +new Date(b.createdAt) - +new Date(a.createdAt),
      );
      return list;
    }
    list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [filtered, sort]);

  const grouped = useMemo(() => {
    if (sort !== "new") {
      return [{ key: "all", label: "Лента", items: sorted }];
    }
    const map = new Map<
      string,
      { key: string; label: string; items: NewsItem[] }
    >();
    for (const it of sorted) {
      const d = new Date(it.createdAt);
      const k = getDayKey(d);
      const entry = map.get(k) || { key: k, label: dayLabel(d), items: [] };
      entry.items.push(it);
      map.set(k, entry);
    }
    // preserve order by date desc
    const arr = Array.from(map.values());
    arr.sort((a, b) => (a.key < b.key ? 1 : -1));
    return arr;
  }, [sorted, sort]);

  // Прокрутка к новости по hash в URL
  useEffect(() => {
    if (loading || sorted.length === 0) return;

    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [loading, sorted.length]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Фоновые блики */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero — Card (shadcn-style) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-6 sm:mb-8"
          >
            <Card variant="glass" padding="lg" className="relative overflow-hidden border-[#abd1c6]/25 shadow-xl shadow-[#001e1d]/30">
              <CardContent className="p-0">
                <div className="relative p-5 sm:p-6 lg:p-8">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#f9bc60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#abd1c6]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-8">
                    <div className="min-w-0 flex-1">
                      <Badge variant="secondary" className="gap-1.5 mb-3">
                        <LucideIcons.Megaphone className="w-3.5 h-3.5" />
                        Лента обновлений
                      </Badge>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#fffffe] leading-tight">
                        Новости проекта
                      </h1>
                      <p className="mt-2 text-sm sm:text-base text-[#abd1c6]/90 max-w-2xl">
                        Обновления, фичи, важные объявления и изменения на
                        платформе.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 flex-shrink-0 w-full sm:w-auto">
                      <a
                        href="https://t.me/kkopilka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#004643]/40 hover:bg-[#004643]/60 border border-[#abd1c6]/20 hover:border-[#abd1c6]/35 transition-all duration-200 w-full sm:w-auto"
                        title="Телеграм канал"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#abd1c6]/20">
                          <img src="/logo12.png" alt="Telegram" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 sm:flex-initial text-left sm:text-right min-w-0">
                          <div className="text-xs font-semibold text-[#fffffe] truncate">@kkopilka</div>
                          <div className="text-[10px] text-[#abd1c6]/80">Подписывайся</div>
                        </div>
                      </a>
                      <a
                        href="https://kick.com/koponline"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#004643]/40 hover:bg-[#004643]/60 border border-[#abd1c6]/20 hover:border-[#abd1c6]/35 transition-all duration-200 w-full sm:w-auto"
                        title="Kick стрим"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#abd1c6]/20">
                          <img src="/kick.png" alt="Kick" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 sm:flex-initial text-left sm:text-right min-w-0">
                          <div className="text-xs font-semibold text-[#fffffe] truncate">koponline</div>
                          <div className="text-[10px] text-[#abd1c6]/80">Стримы</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="mb-4 sm:mb-5">
            <NewsControlsBar
              query={query}
              onQueryChange={setQuery}
              sort={sort}
              onSortChange={setSort}
              onRefresh={load}
              refreshing={loading}
              resultCount={!loading && !error ? filtered.length : undefined}
            />
          </div>

          {/* Layout: feed + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 lg:gap-6 items-start">
            <div className="min-w-0">
              {loading ? (
                <NewsFeedSkeleton count={3} />
              ) : error ? (
                <Card variant="default" padding="lg" className="border-red-400/30 bg-red-500/10">
                  <CardContent>
                    <div className="flex items-center gap-2 font-bold text-[#fffffe]">
                      <LucideIcons.AlertTriangle size="sm" className="text-red-300" />
                      Ошибка загрузки
                    </div>
                    <p className="mt-2 text-[#abd1c6]">{error}</p>
                    <button
                      onClick={load}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f9bc60]/20 hover:bg-[#f9bc60]/30 border border-[#f9bc60]/40 text-[#f9bc60] text-sm font-semibold transition-colors"
                    >
                      <LucideIcons.RefreshCw size="sm" />
                      Повторить
                    </button>
                  </CardContent>
                </Card>
              ) : items.length === 0 ? (
                <Card variant="glass" padding="lg" className="text-center max-w-md mx-auto">
                  <CardContent className="pt-2 pb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#f9bc60]/10 border border-[#f9bc60]/20 mb-4">
                      <LucideIcons.Megaphone className="w-8 h-8 text-[#f9bc60]/80" />
                    </div>
                    <h3 className="text-xl font-bold text-[#fffffe]">Пока новостей нет</h3>
                    <p className="mt-2 text-sm text-[#abd1c6]/80">
                      Здесь появятся анонсы и обновления. Подпишитесь на канал, чтобы не пропустить.
                    </p>
                    <a
                      href="https://t.me/kkopilka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#004643]/60 hover:bg-[#004643]/80 border border-[#abd1c6]/25 text-[#abd1c6] hover:text-[#f9bc60] text-sm font-semibold transition-colors"
                    >
                      <LucideIcons.Megaphone className="w-4 h-4" />
                      Telegram-канал
                    </a>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8 sm:space-y-10">
                  {grouped.map((g, groupIdx) => {
                    const isFirstGroup = groupIdx === 0;
                    const isToday = g.label === "Сегодня";
                    const featuredId = sort === "new" && isFirstGroup && isToday && g.items[0]?.id;

                    return (
                      <motion.section
                        key={g.key}
                        aria-labelledby={`news-group-${g.key}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: groupIdx * 0.08, ease: "easeOut" }}
                      >
                        <Separator className="mb-4 bg-[#abd1c6]/15" />
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="secondary" id={`news-group-${g.key}`} className="text-xs font-semibold px-3 py-1">
                            {g.label}
                          </Badge>
                          <span className="text-xs text-[#abd1c6]/60">
                            {g.items.length} {getPostWord(g.items.length)}
                          </span>
                        </div>
                        <div className="space-y-5 sm:space-y-6">
                          {g.items.map((it, idx) => (
                            <NewsPostCard
                              key={it.id}
                              item={it}
                              featured={it.id === featuredId}
                            />
                          ))}
                        </div>
                      </motion.section>
                    );
                  })}

                  {nextCursor && (
                    <div className="pt-4 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#abd1c6]/25 bg-[#004643]/50 hover:bg-[#004643]/70 text-[#fffffe] font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-wait"
                      >
                        {loadingMore ? (
                          <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <LucideIcons.ChevronDown size="sm" />
                        )}
                        {loadingMore ? "Загрузка…" : "Показать ещё"}
                      </button>
                    </div>
                  )}

                  {!nextCursor && items.length > 0 && (
                    <div className="pt-4 flex items-center justify-center gap-2">
                      <Separator className="flex-1 max-w-[80px]" />
                      <span className="text-xs text-[#abd1c6]/50">Конец ленты</span>
                      <Separator className="flex-1 max-w-[80px]" />
                    </div>
                  )}
                </div>
              )}

              {/* mobile sidebar */}
              {!loading && !error && (
                <div className="mt-5 lg:hidden">
                  <NewsSidebar
                    items={sorted}
                    lastUpdatedAt={lastUpdatedAt}
                    variant="mobile"
                  />
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <NewsSidebar
                items={sorted}
                lastUpdatedAt={lastUpdatedAt}
                variant="desktop"
              />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
