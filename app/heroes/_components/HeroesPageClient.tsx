"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import HeroesHero from "@/components/heroes/HeroesHero";
import HeroesContent from "@/components/heroes/HeroesContent";
import HeroesLoading from "@/components/heroes/HeroesLoading";
import type { HeroBadge as HeroBadgeType } from "@/lib/heroBadges";

export interface Hero {
  id: string;
  name: string;
  avatar?: string;
  heroBadge?: HeroBadgeType | null;
  totalDonated: number;
  donationCount: number;
  rank: number;
  joinedAt: string;
  hasExtendedPlacement?: boolean;
  isSubscriber?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
}

export type HeroesStats = {
  totalHeroes: number;
  totalDonated: number;
  subscribersCount: number;
  averageDonation: number;
};

interface HeroesPageClientProps {
  initialTopThree: Hero[];
  initialHeroes: Hero[];
  initialStats: HeroesStats;
  initialListTotal: number;
  initialPages: number;
}

export default function HeroesPageClient({
  initialTopThree,
  initialHeroes,
  initialStats,
  initialListTotal,
  initialPages,
}: HeroesPageClientProps) {
  const [topThree, setTopThree] = useState<Hero[]>(initialTopThree);
  const [heroes, setHeroes] = useState<Hero[]>(initialHeroes);
  const [stats, setStats] = useState<HeroesStats>(initialStats);
  const [listTotal, setListTotal] = useState(initialListTotal);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"total" | "count" | "date">("total");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(initialPages);
  const hasMore = page < pages;

  const observerTargetRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const skipInitialLoadRef = useRef(true);

  const debouncedQuery = useMemo(() => searchTerm.trim(), [searchTerm]);
  const [effectiveQuery, setEffectiveQuery] = useState("");

  useEffect(() => {
    setTopThree(initialTopThree);
    setHeroes(initialHeroes);
    setStats(initialStats);
    setListTotal(initialListTotal);
    setPages(initialPages);
    setPage(1);
  }, [
    initialTopThree,
    initialHeroes,
    initialStats,
    initialListTotal,
    initialPages,
  ]);

  useEffect(() => {
    const t = window.setTimeout(() => setEffectiveQuery(debouncedQuery), 300);
    return () => window.clearTimeout(t);
  }, [debouncedQuery]);

  useEffect(() => {
    if (skipInitialLoadRef.current) {
      skipInitialLoadRef.current = false;
      return;
    }
    setPage(1);
    setHeroes([]);
    loadPage(1, true);
  }, [sortBy, effectiveQuery]);

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
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
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
