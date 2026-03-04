"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  StoriesHeader,
  StoriesLoading,
} from "@/components/stories";
import { useStories } from "@/hooks/stories/useStories";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { useAuth } from "@/hooks/useAuth";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { StoriesEmptyWithAd } from "./sections/StoriesEmptyWithAd";
import { TopStoriesSection } from "./sections/TopStoriesSection";
import { StoriesSummaryBanner } from "./sections/StoriesSummaryBanner";
import { StoriesGrid } from "./sections/StoriesGrid";

interface StoriesPageClientProps {
  initialTopStories?: StoryItem[];
  initialStories?: StoryItem[];
  initialStoriesHasMore?: boolean;
}

export default function StoriesPageClient({
  initialTopStories = [],
  initialStories = [],
  initialStoriesHasMore = true,
}: StoriesPageClientProps) {
  const { isAuthenticated } = useAuth();
  const [readStoryIds, setReadStoryIds] = useState<Set<string>>(new Set());
  const [topStories, setTopStories] = useState<StoryItem[]>(initialTopStories);
  const [topLoading, setTopLoading] = useState(initialTopStories.length === 0);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    setTopStories(initialTopStories);
    setTopLoading(initialTopStories.length === 0);
  }, [initialTopStories]);

  const {
    stories,
    loading,
    loadingMore,
    hasMore,
    currentPage,
    query,
    setQuery,
    sort,
    setSort,
    loadNextPage,
    observerTargetRef,
    isInitialLoad,
  } = useStories({
    initialStories,
    initialStoriesHasMore,
  });

  const hasQuery = query.trim().length > 0;
  // Учитываем prefers-reduced-motion: не анимируем карточки, если пользователь просит меньше движения
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  // Анимируем карточки только при первой загрузке и если пользователь не просит меньше движения
  const shouldAnimate =
    !prefersReducedMotion &&
    isInitialLoad &&
    !loading &&
    stories.length <= 24;
  const autoLoadLimit = 3;
  const autoLoadEnabled = currentPage < autoLoadLimit;

  // Intersection Observer для бесконечной прокрутки: переподписываемся при
  // появлении сетки (stories.length > 0), чтобы ref был уже в DOM
  useEffect(() => {
    if (!stories.length) return;
    if (!autoLoadEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    stories.length,
    loadingMore,
    hasMore,
    loading,
    loadNextPage,
    observerTargetRef,
    autoLoadEnabled,
  ]);

  // Восстановление скролла после возврата из истории: повторяем попытку по мере
  // подгрузки страниц (бесконечный скролл), т.к. при первом рендере контента
  // может быть мало и браузер ограничит скролл высотой документа.
  useEffect(() => {
    if (restoredRef.current) return;
    if (loading) return;
    if (!stories.length) return;
    if (typeof window === "undefined") return;

    const saved = sessionStorage.getItem("stories-scroll");
    if (!saved) {
      restoredRef.current = true;
      return;
    }

    const targetY = parseInt(saved, 10);
    if (!Number.isFinite(targetY) || targetY < 0) {
      sessionStorage.removeItem("stories-scroll");
      restoredRef.current = true;
      return;
    }

    window.scrollTo({ top: targetY, behavior: "auto" });

    const checkAndMaybeClear = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const tolerance = 50;
      const reached = targetY <= maxScroll + tolerance;

      if (reached) {
        sessionStorage.removeItem("stories-scroll");
        restoredRef.current = true;
        return;
      }

      // Контента ещё мало; если страниц больше нет — сдаёмся и остаёмся где есть
      if (!hasMore && !loadingMore) {
        sessionStorage.removeItem("stories-scroll");
        restoredRef.current = true;
      }
    };

    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(checkAndMaybeClear);
    });

    return () => cancelAnimationFrame(rafId);
  }, [loading, stories.length, hasMore, loadingMore]);

  useEffect(() => {
    if (initialTopStories.length > 0) return;
    let isMounted = true;
    const loadTopStories = async () => {
      try {
        setTopLoading(true);
        const response = await fetch("/api/stories/top?limit=3", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && Array.isArray(data.items)) {
          setTopStories(data.items);
        }
      } catch (error) {
        console.error("Failed to load top stories:", error);
      } finally {
        if (isMounted) {
          setTopLoading(false);
        }
      }
    };

    loadTopStories();

    return () => {
      isMounted = false;
    };
  }, [initialTopStories.length]);

  useEffect(() => {
    let isMounted = true;
    const loadSummary = async () => {
      try {
        const response = await fetch("/api/stories/summary", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted && typeof data.totalPaid === "number") {
          setTotalPaid(data.totalPaid);
        }
      } catch (error) {
        console.error("Failed to load stories summary:", error);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("stories-read-ids");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setReadStoryIds(new Set(parsed.filter((id) => typeof id === "string")));
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  const syncReadFromStorage = () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("stories-read-ids");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setReadStoryIds(new Set(parsed.filter((id) => typeof id === "string")));
      }
    } catch {
      // ignore malformed storage
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    syncReadFromStorage();

    const handlePageShow = () => syncReadFromStorage();
    const handleFocus = () => syncReadFromStorage();
    const handlePopState = () => syncReadFromStorage();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncReadFromStorage();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Фоновые блики */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004643]/10 rounded-full blur-3xl" />
      </div>

      <StoriesHeader query={query} onQueryChange={setQuery} />

      <div className="relative w-full h-12 sm:h-16 overflow-hidden pointer-events-none" aria-hidden>
        <svg className="absolute inset-0 w-full h-full text-[#001e1d]" viewBox="0 0 1200 48" fill="none" preserveAspectRatio="none">
          <path d="M0 24 Q300 0 600 24 T1200 24 V48 H0 Z" fill="currentColor" opacity="0.04" />
          <path d="M0 32 Q300 8 600 32 T1200 32 V48 H0 Z" fill="currentColor" opacity="0.06" />
        </svg>
      </div>

      <main className="relative z-10 -mt-8 sm:-mt-10" id="stories-main" aria-label="Список историй платформы">
        {loading ? (
          <StoriesLoading />
        ) : stories.length === 0 ? (
          <StoriesEmptyWithAd hasQuery={hasQuery} />
        ) : (
          <>
            {!hasQuery && !topLoading && topStories.length > 0 && (
              <TopStoriesSection
                topStories={topStories}
                readStoryIds={readStoryIds}
              />
            )}
            {totalPaid !== null && !hasQuery && (
              <StoriesSummaryBanner totalPaid={totalPaid} />
            )}

            {!hasQuery && stories.length > 0 && (
              <div className="container mx-auto px-4 pb-4 flex flex-wrap items-center justify-center gap-3">
                {readStoryIds.size > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#abd1c6]/30 bg-[#004643]/40 backdrop-blur-sm px-4 py-2.5 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9bc60]/20 text-[#f9bc60]" aria-hidden>
                      <LucideIcons.BookOpen className="h-4 w-4" />
                    </span>
                    <span className="text-[#fffffe] font-medium">
                      Вы прочитали{" "}
                      <span className="font-bold text-[#f9bc60] tabular-nums">{readStoryIds.size}</span>{" "}
                      {readStoryIds.size === 1 ? "историю" : readStoryIds.size < 5 ? "истории" : "историй"}
                    </span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 rounded-full border border-[#abd1c6]/25 bg-[#001e1d]/40 backdrop-blur-sm px-4 py-2 text-sm text-[#abd1c6]/90">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e16162]/20 text-[#e16162]" aria-hidden>
                    <LucideIcons.Heart className="h-3.5 w-3.5 fill-[#e16162]/80" />
                  </span>
                  <span>Лайк — это поддержка автора истории</span>
                </div>
              </div>
            )}

            {!hasQuery && (
              <div className="container mx-auto px-4 pb-6 flex justify-center">
                <Link
                  href="/applications"
                  className="group block w-full max-w-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9bc60]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#001e1d] rounded-2xl"
                >
                  <Card variant="darkGlass" padding="sm" className="overflow-hidden transition-all duration-300 hover:border-[#f9bc60]/30 hover:shadow-[0_12px_40px_-12px_rgba(249,188,96,0.2)]">
                    <CardContent className="flex items-center gap-4 p-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f9bc60]/30 to-[#e8a545]/20 text-[#f9bc60] transition-transform duration-300 group-hover:scale-110" aria-hidden>
                        <LucideIcons.Edit3 className="h-6 w-6" />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-semibold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                          Рассказать свою историю
                        </p>
                        <p className="text-xs text-[#abd1c6]/90 mt-0.5">
                          Подать заявку на поддержку
                        </p>
                      </div>
                      <LucideIcons.ArrowRight className="h-5 w-5 shrink-0 text-[#abd1c6]/70 group-hover:text-[#f9bc60] group-hover:translate-x-1 transition-all duration-300" aria-hidden />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            )}

            <StoriesGrid
              stories={stories}
              shouldAnimate={shouldAnimate}
              isAuthenticated={isAuthenticated}
              query={query}
              sort={sort}
              onSortChange={setSort}
              readStoryIds={readStoryIds}
              loadingMore={loadingMore}
              hasMore={hasMore}
              observerTargetRef={observerTargetRef}
              autoLoadEnabled={autoLoadEnabled}
              onLoadMore={loadNextPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
