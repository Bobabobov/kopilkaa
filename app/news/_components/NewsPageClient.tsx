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
import { Megaphone } from "lucide-react";

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
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 sm:mb-8"
          >
            <Card variant="darkGlass" padding="lg" className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative p-5 sm:p-6 lg:p-8">
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 lg:gap-8">
                    <div className="min-w-0 flex-1">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-3"
                        style={{ color: "#f9bc60", letterSpacing: "0.12em" }}
                      >
                        <Megaphone className="w-4 h-4" />
                        Лента обновлений
                      </span>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#fffffe] leading-tight tracking-tight">
                        Новости проекта
                      </h1>
                      <p className="mt-2 text-sm sm:text-base text-[#abd1c6] max-w-2xl">
                        Обновления, фичи, важные объявления и изменения на платформе.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 flex-shrink-0 w-full sm:w-auto">
                      <a
                        href="https://t.me/kkopilka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#f9bc60]/30 transition-all w-full sm:w-auto"
                        title="Телеграм канал"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                          <img src="/logo12.png" alt="Telegram" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 sm:flex-initial text-left sm:text-right min-w-0">
                          <div className="text-xs font-semibold text-[#fffffe] truncate">@kkopilka</div>
                          <div className="text-[10px] text-[#94a1b2]">Подписывайся</div>
                        </div>
                      </a>
                      <a
                        href="https://kick.com/koponline"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-[#f9bc60]/30 transition-all w-full sm:w-auto"
                        title="Kick стрим"
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                          <img src="/kick.png" alt="Kick" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 sm:flex-initial text-left sm:text-right min-w-0">
                          <div className="text-xs font-semibold text-[#fffffe] truncate">koponline</div>
                          <div className="text-[10px] text-[#94a1b2]">Стримы</div>
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
                <Card variant="darkGlass" padding="lg" className="border-red-400/20">
                  <CardContent>
                    <div className="flex items-center gap-2 font-bold text-[#fffffe]">
                      <LucideIcons.AlertTriangle size="sm" className="text-red-400" />
                      Ошибка загрузки
                    </div>
                    <p className="mt-2 text-[#abd1c6]">{error}</p>
                    <button
                      onClick={load}
                      className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{
                        background: "rgba(249, 188, 96, 0.2)",
                        color: "#f9bc60",
                        border: "1px solid rgba(249, 188, 96, 0.4)",
                      }}
                    >
                      <LucideIcons.RefreshCw size="sm" />
                      Повторить
                    </button>
                  </CardContent>
                </Card>
              ) : items.length === 0 ? (
                <Card variant="darkGlass" padding="lg" className="text-center max-w-md mx-auto">
                  <CardContent className="pt-2 pb-6">
                    <div
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 text-[#f9bc60]"
                      style={{ background: "rgba(249, 188, 96, 0.12)" }}
                    >
                      <LucideIcons.Megaphone className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#fffffe]">Пока новостей нет</h3>
                    <p className="mt-2 text-sm text-[#abd1c6]">
                      Здесь появятся анонсы и обновления. Подпишитесь на канал, чтобы не пропустить.
                    </p>
                    <a
                      href="https://t.me/kkopilka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{
                        background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                        color: "#001e1d",
                        boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                      }}
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
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: groupIdx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="h-px bg-white/10 mb-5" aria-hidden />
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            id={`news-group-${g.key}`}
                            className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg"
                            style={{ background: "rgba(249, 188, 96, 0.15)", color: "#f9bc60" }}
                          >
                            {g.label}
                          </span>
                          <span className="text-xs text-[#94a1b2]">
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
                    <div className="pt-6 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-wait hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          color: "#001e1d",
                          boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                        }}
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
                    <div className="pt-6 flex items-center justify-center gap-3">
                      <span className="flex-1 max-w-20 h-px bg-white/10" aria-hidden />
                      <span className="text-xs text-[#94a1b2]">Конец ленты</span>
                      <span className="flex-1 max-w-20 h-px bg-white/10" aria-hidden />
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
