"use client";

import { useEffect, useState, useRef } from "react";
import {
  StoriesHeader,
  StoriesLoading,
} from "@/components/stories";
import { useStories } from "@/hooks/stories/useStories";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="min-h-screen">
      {/* Header */}
      <StoriesHeader query={query} onQueryChange={setQuery} />

      {/* Main content */}
      <main className="relative z-10" id="stories-main" aria-label="Список историй платформы">
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

            <StoriesGrid
              stories={stories}
              shouldAnimate={shouldAnimate}
              isAuthenticated={isAuthenticated}
              query={query}
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
