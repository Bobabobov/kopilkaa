"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { NewsItem } from "@/components/news/types";
import { NewsPostCard } from "@/components/news/NewsPostCard";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { NewsControlsBar, type NewsSort } from "@/components/news/NewsControlsBar";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { NewsFeedSkeleton } from "@/components/news/NewsFeedSkeleton";

type ApiResponse = { items: NewsItem[]; nextCursor: string | null };

function getDayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayLabel(d: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThat = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfToday.getTime() - startOfThat.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Сегодня";
  if (diffDays === 1) return "Вчера";
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
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
  const [nextCursor, setNextCursor] = useState<string | null>(() => initialNextCursor);
  const [loading, setLoading] = useState(() => initialItems.length === 0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<NewsSort>("new");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(initialLastUpdatedAt);

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
          (b.likesCount - b.dislikesCount) - (a.likesCount - a.dislikesCount) ||
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
    const map = new Map<string, { key: string; label: string; items: NewsItem[] }>();
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
      <div className="relative z-10 w-full px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-3xl border border-[#abd1c6]/20 bg-gradient-to-br from-[#004643]/55 to-[#001e1d]/35 p-6 sm:p-8 mb-5 sm:mb-6"
          >
            <div className="absolute -top-14 -right-14 w-52 h-52 bg-[#f9bc60]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#abd1c6]/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/10 text-xs font-bold text-white/80">
                    <LucideIcons.Megaphone size="xs" />
                    Лента обновлений
                  </div>
                  <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#fffffe] leading-tight">
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
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 w-full sm:w-auto"
                    title="Телеграм канал"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/logo12.png" alt="Telegram" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 sm:flex-initial text-left sm:text-right">
                      <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                        @kkopilka
                      </div>
                      <div className="text-[10px] sm:text-[10px] text-white/60 group-hover:text-white/80 transition-colors">
                        Подписывайся, чтобы быть в курсе
                      </div>
                    </div>
                  </a>
                  <a
                    href="https://kick.com/koponline"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 w-full sm:w-auto"
                    title="Kick стрим"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/kick.png" alt="Kick" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 sm:flex-initial text-left sm:text-right">
                      <div className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                        koponline
                      </div>
                      <div className="text-[10px] sm:text-[10px] text-white/60 group-hover:text-white/80 transition-colors">
                        Подписывайся, чтобы не пропустить стримы
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mb-4 sm:mb-5">
            <NewsControlsBar
              query={query}
              onQueryChange={setQuery}
              sort={sort}
              onSortChange={setSort}
              onRefresh={load}
              refreshing={loading}
            />
          </div>

          {/* Layout: feed + sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 lg:gap-6 items-start">
            <div className="min-w-0">
              {loading ? (
                <NewsFeedSkeleton count={3} />
              ) : error ? (
                <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-6 text-white">
                  <div className="flex items-center gap-2 font-bold">
                    <LucideIcons.AlertTriangle size="sm" className="text-red-300" />
                    Ошибка загрузки
                  </div>
                  <div className="mt-2 text-white/80">{error}</div>
                  <button
                    onClick={load}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-semibold"
                  >
                    <LucideIcons.RefreshCw size="sm" />
                    Повторить
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="rounded-3xl border border-[#abd1c6]/20 bg-[#004643]/35 p-8 text-center">
                  <div className="text-[#fffffe] font-bold text-lg">Пока новостей нет</div>
                  <div className="mt-2 text-[#abd1c6]">Загляните чуть позже.</div>
                </div>
              ) : (
                <div className="space-y-5">
                  {grouped.map((g) => (
                    <div key={g.key} className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm sm:text-base font-black text-white/85">
                          {g.label}
                        </h2>
                        <span className="text-xs text-white/45">
                          {g.items.length} {getPostWord(g.items.length)}
                        </span>
                      </div>
                      <div className="space-y-4 sm:space-y-5">
                        {g.items.map((it) => (
                          <NewsPostCard key={it.id} item={it} />
                        ))}
                      </div>
                    </div>
                  ))}

                  {nextCursor && (
                    <div className="pt-2 flex justify-center">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/35 hover:bg-[#001e1d]/45 text-[#fffffe] font-bold transition ${
                          loadingMore ? "opacity-70 cursor-wait" : ""
                        }`}
                      >
                        <LucideIcons.ChevronDown size="sm" />
                        {loadingMore ? "Загрузка..." : "Показать ещё"}
                      </button>
                    </div>
                  )}

                  {!nextCursor && items.length > 0 && (
                    <div className="pt-2 text-center text-xs text-white/45">
                      Конец ленты
                    </div>
                  )}
                </div>
              )}

              {/* mobile sidebar */}
              {!loading && !error && (
                <div className="mt-5 lg:hidden">
                  <NewsSidebar items={sorted} lastUpdatedAt={lastUpdatedAt} variant="mobile" />
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <NewsSidebar items={sorted} lastUpdatedAt={lastUpdatedAt} variant="desktop" />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


