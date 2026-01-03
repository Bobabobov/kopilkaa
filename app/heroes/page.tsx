// app/heroes/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeroesHero from "@/components/heroes/HeroesHero";
import HeroesContent from "@/components/heroes/HeroesContent";
import HeroesLoading from "@/components/heroes/HeroesLoading";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

interface Hero {
  id: string;
  name: string;
  avatar?: string;
  heroBadge?: HeroBadgeType | null;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: string;
  // Новая семантика: “расширенное размещение” (>= 3 оплат размещения)
  hasExtendedPlacement?: boolean;
  // Backward-compatible: раньше было “подписчик” (семантика изменена, но поле может прилетать из старого кэша)
  isSubscriber?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

type HeroesStats = {
  totalHeroes: number;
  totalDonated: number;
  subscribersCount: number;
  averageDonation: number;
};

export default function HeroesPage() {
  const [topThree, setTopThree] = useState<Hero[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [stats, setStats] = useState<HeroesStats>({
    totalHeroes: 0,
    totalDonated: 0,
    subscribersCount: 0,
    averageDonation: 0,
  });
  const [listTotal, setListTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"total" | "count" | "date">("total");
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const hasMore = page < pages;

  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const debouncedQuery = useMemo(() => searchTerm.trim(), [searchTerm]);

  // Debounce input -> server search
  const [effectiveQuery, setEffectiveQuery] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setEffectiveQuery(debouncedQuery), 300);
    return () => window.clearTimeout(t);
  }, [debouncedQuery]);

  useEffect(() => {
    // reset and load first page when filters change
    setPage(1);
    setHeroes([]);
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, effectiveQuery]);

  // Lazy load next pages
  useEffect(() => {
    const el = observerTargetRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries[0]?.isIntersecting;
        if (!hit) return;
        if (loading || loadingMore) return;
        if (!hasMore) return;
        const next = page + 1;
        loadPage(next, false);
      },
      { threshold: 0.1, rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, loadingMore, page]);

  const loadPage = async (p: number, reset: boolean) => {
    try {
      setError(null);
      if (reset) setLoading(true);
      else setLoadingMore(true);

      if (abortRef.current && !abortRef.current.signal.aborted) {
        abortRef.current.abort();
      }
      const ac = new AbortController();
      abortRef.current = ac;

      const params = new URLSearchParams({
        page: String(p),
        limit: "24",
        sortBy,
        ...(effectiveQuery ? { q: effectiveQuery } : {}),
      });

      const response = await fetch(`/api/heroes?${params}`, {
        cache: "no-store",
        signal: ac.signal,
      });
      if (!response.ok) {
        throw new Error("Ошибка загрузки героев");
      }
      const data = await response.json();
      if (reset) {
        setTopThree(data.topThree || []);
        setHeroes(data.items || []);
      } else {
        setHeroes((prev) => [...prev, ...(data.items || [])]);
      }
      setStats(data.stats || stats);
      setListTotal(data.listTotal || 0);
      setPages(data.pages || 0);
      setPage(data.page || p);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return <HeroesLoading />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <HeroesHero />
        <HeroesContent
          topThree={topThree}
          heroes={heroes}
          listTotal={listTotal}
          stats={stats}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          hasMore={hasMore}
          loadingMore={loadingMore}
          observerTargetRef={observerTargetRef}
          error={error}
          onRetry={() => loadPage(1, true)}
        />
      </div>
    </div>
  );
}
