"use client";

import { useEffect, useState, useRef } from "react";
import { StoriesLoading } from "@/components/stories";
import { useStories } from "@/hooks/stories/useStories";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { useAuth } from "@/hooks/useAuth";
import { StoriesEmptyWithAd } from "./sections/StoriesEmptyWithAd";
import { StoriesInsightsRow } from "./sections/StoriesInsightsRow";
import { StoriesGrid } from "./sections/StoriesGrid";
import { StoriesPageHeader } from "./StoriesPageHeader";
import { StoriesPageBackground } from "./stories-ui/StoriesPageBackground";
import { logRouteCatchError } from "@/lib/api/parseApiError";

interface StoriesPageClientProps {
  initialRandomStory?: StoryItem | null;
  initialStories?: StoryItem[];
  initialStoriesHasMore?: boolean;
  initialTotalPaid?: number | null;
}

export default function StoriesPageClient({
  initialRandomStory = null,
  initialStories = [],
  initialStoriesHasMore = true,
  initialTotalPaid = null,
}: StoriesPageClientProps) {
  const { isAuthenticated } = useAuth();
  const [readStoryIds, setReadStoryIds] = useState<Set<string>>(new Set());
  const [randomStory, setRandomStory] = useState<StoryItem | null>(
    initialRandomStory,
  );
  const [randomLoading, setRandomLoading] = useState(
    initialRandomStory === null,
  );
  const [totalPaid, setTotalPaid] = useState<number | null>(initialTotalPaid);
  const restoredRef = useRef(false);

  useEffect(() => {
    setRandomStory(initialRandomStory);
    setRandomLoading(initialRandomStory === null);
  }, [initialRandomStory]);

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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobileViewport(mq.matches);
    const handler = () => setIsMobileViewport(mq.matches);
    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);
  const shouldAnimate =
    !prefersReducedMotion &&
    !isMobileViewport &&
    isInitialLoad &&
    !loading &&
    stories.length <= 24;
  const autoLoadLimit = isMobileViewport ? 2 : 3;
  const autoLoadEnabled = currentPage < autoLoadLimit;

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
    if (initialRandomStory !== null) return;
    let isMounted = true;
    const loadRandomStory = async () => {
      try {
        setRandomLoading(true);
        const response = await fetch("/api/stories/random", {
          cache: "no-store",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (
          isMounted &&
          data.item &&
          typeof data.item.id === "string"
        ) {
          setRandomStory(data.item);
        }
      } catch (error) {
        logRouteCatchError("[StoriesPageClient] loadRandomStory", error);
      } finally {
        if (isMounted) {
          setRandomLoading(false);
        }
      }
    };

    loadRandomStory();

    return () => {
      isMounted = false;
    };
  }, [initialRandomStory]);

  useEffect(() => {
    if (initialTotalPaid !== null) return;
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
        logRouteCatchError("[StoriesPageClient] loadSummary", error);
      }
    };

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, [initialTotalPaid]);

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
    <div className="relative min-h-screen" data-stories-page>
      <StoriesPageBackground />

      <StoriesPageHeader query={query} onQueryChange={setQuery} />

      <main
        className="relative z-10 pb-12"
        id="stories-main"
        aria-label="Список историй платформы"
      >
        {loading ? (
          <StoriesLoading />
        ) : stories.length === 0 ? (
          <StoriesEmptyWithAd hasQuery={hasQuery} />
        ) : (
          <>
            {!hasQuery && (
              <StoriesInsightsRow
                randomStory={randomStory}
                randomLoading={randomLoading}
                totalPaid={totalPaid}
                readStoryIds={readStoryIds}
              />
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
