"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  StoriesHeader,
  StoryCard,
  AdCard,
  StoriesLoading,
  StoriesEmptyState,
} from "@/components/stories";
import { useStories } from "@/hooks/stories/useStories";
import type { Story as StoryItem } from "@/hooks/stories/useStories";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useRef } from "react";

export default function StoriesPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [readStoryIds, setReadStoryIds] = useState<Set<string>>(new Set());
  const [topStories, setTopStories] = useState<StoryItem[]>([]);
  const [topLoading, setTopLoading] = useState(true);
  const [totalPaid, setTotalPaid] = useState<number | null>(null);
  const restoredRef = useRef(false);
  const {
    stories,
    loading,
    loadingMore,
    hasMore,
    query,
    setQuery,
    loadNextPage,
    observerTargetRef,
    isInitialLoad,
  } = useStories();

  // Проверяем авторизацию один раз (без N+1 на карточки)
  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => setIsAuthenticated(r.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);

  // Intersection Observer для бесконечной прокрутки
  useEffect(() => {
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
  }, [loadingMore, hasMore, loading, loadNextPage, observerTargetRef]);

  // Восстановление скролла после возврата из истории
  useEffect(() => {
    if (restoredRef.current) return;
    if (loading) return;
    if (!stories.length) return;
    if (typeof window === "undefined") return;
    const saved = sessionStorage.getItem("stories-scroll");
    if (saved) {
      const y = parseInt(saved, 10);
      if (Number.isFinite(y)) {
        window.scrollTo({ top: y, behavior: "auto" });
      }
      sessionStorage.removeItem("stories-scroll");
    }
    restoredRef.current = true;
  }, [loading, stories.length]);

  useEffect(() => {
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
  }, []);

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

  const hasQuery = query.trim().length > 0;
  // Анимируем карточки только при первой загрузке (не при подгрузке следующих страниц)
  const shouldAnimate = isInitialLoad && !loading;
  const formatAmount = (value?: number | null) =>
    typeof value === "number"
      ? new Intl.NumberFormat("ru-RU").format(value)
      : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <StoriesHeader query={query} onQueryChange={setQuery} />

      {/* Content */}
      <div className="relative z-10">
        {loading ? (
          <StoriesLoading />
        ) : stories.length === 0 ? (
          <>
            {/* Показываем рекламную карточку даже когда нет историй */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AdCard index={0} />
              </div>
            </div>
            <StoriesEmptyState hasQuery={hasQuery} />
          </>
        ) : (
          <>
            {!hasQuery && !topLoading && topStories.length > 0 && (
              <div className="container mx-auto px-4 pt-2 pb-8">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-[#f9bc60]/10 backdrop-blur-md p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg sm:text-xl font-black text-[#fffffe]">
                      Топ историй
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f9bc60]/20 text-[#f9bc60] text-[11px] font-bold uppercase tracking-wide">
                      по лайкам
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {topStories.map((story, index) => {
                      const amountText = formatAmount(story.amount);
                      const imageUrl =
                        story.images?.[0]?.url || "/stories-preview.jpg";
                      const avatarUrl =
                        story.user?.avatar || "/default-avatar.png";
                      const authorName =
                        story.user?.name ||
                        story.user?.email ||
                        "Неизвестный автор";
                      const rankIcon =
                        index === 0
                          ? "Crown"
                          : index === 1
                            ? "Medal"
                            : "Award";
                      const rankColor =
                        index === 0
                          ? "text-[#f9bc60]"
                          : index === 1
                            ? "text-[#abd1c6]"
                            : "text-[#e8a545]";
                      const RankIcon =
                        rankIcon === "Crown"
                          ? LucideIcons.Crown
                          : rankIcon === "Medal"
                            ? LucideIcons.Medal
                            : LucideIcons.Award;

                      return (
                        <div
                          key={`top-${story.id}`}
                          role="link"
                          tabIndex={0}
                          onClick={() => router.push(`/stories/${story.id}`)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              router.push(`/stories/${story.id}`);
                            }
                          }}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-[#f9bc60]/50 hover:bg-white/10 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#f9bc60]/15 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f9bc60]/50"
                        >
                          <div className="relative h-28 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={story.title}
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.src = "/stories-preview.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-black text-white">
                              <RankIcon size="xs" className={rankColor} />
                              #{index + 1}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {story.user?.id ? (
                                <Link
                                  href={`/profile/${story.user.id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-xs text-[#abd1c6] hover:text-[#f9bc60] transition-colors"
                                >
                                  <img
                                    src={avatarUrl}
                                    alt={authorName}
                                    loading="lazy"
                                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                                    onError={(e) => {
                                      e.currentTarget.src = "/default-avatar.png";
                                    }}
                                  />
                                  <span className="line-clamp-1">
                                    {authorName}
                                  </span>
                                </Link>
                              ) : (
                                <div className="flex items-center gap-2 text-xs text-[#abd1c6]">
                                  <img
                                    src={avatarUrl}
                                    alt={authorName}
                                    loading="lazy"
                                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                                    onError={(e) => {
                                      e.currentTarget.src = "/default-avatar.png";
                                    }}
                                  />
                                  <span className="line-clamp-1">
                                    {authorName}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-bold text-[#fffffe] line-clamp-1">
                              {story.title}
                            </div>
                            <div className="text-xs text-[#abd1c6] mt-1 line-clamp-1">
                              {story.summary}
                            </div>
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#abd1c6] bg-white/5 border border-white/10 rounded-full px-2 py-0.5">
                                <LucideIcons.Heart
                                  size="xs"
                                  className="text-[#e16162]"
                                />
                                {story._count?.likes ?? 0}
                              </span>
                              {amountText && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-[#f9bc60] bg-[#f9bc60]/10 border border-[#f9bc60]/30 rounded-full px-2 py-0.5">
                                  <LucideIcons.Ruble
                                    size="xs"
                                    className="text-[#f9bc60]"
                                  />
                                  {amountText} ₽
                                </span>
                              )}
                              {readStoryIds.has(story.id) && (
                                <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wide text-[#001e1d] bg-[#abd1c6] rounded-full px-2 py-0.5">
                                  прочитано
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {totalPaid !== null && !hasQuery && (
              <div className="container mx-auto px-4 pb-6 flex justify-center">
                <div className="relative overflow-hidden rounded-2xl border border-[#f9bc60]/45 bg-gradient-to-r from-[#f9bc60]/20 via-[#f9bc60]/10 to-[#abd1c6]/10 px-5 py-3 text-sm font-semibold text-[#f9bc60] shadow-[0_18px_36px_-20px_rgba(249,188,96,0.7)] backdrop-blur-md">
                  <div className="absolute -top-6 -right-8 h-16 w-16 rounded-full bg-[#f9bc60]/25 blur-2xl" />
                  <div className="absolute -bottom-8 -left-10 h-20 w-20 rounded-full bg-[#abd1c6]/20 blur-2xl" />
                  <div className="relative flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#f9bc60]/50 to-[#e8a545]/30 text-[#001e1d] shadow-inner">
                      <LucideIcons.Ruble size="sm" />
                    </span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[11px] uppercase tracking-wide text-[#dceee6]/80">
                        Проект помог на сумму
                      </span>
                      <span className="text-lg sm:text-xl font-black text-[#f9bc60]">
                        {formatAmount(totalPaid)} ₽
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stories Grid */}
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Рекламная карточка всегда первая */}
                <AdCard index={0} />

                {/* Истории */}
                {stories.map((story, index) => (
                  <StoryCard
                    key={story.id}
                    story={story}
                    index={index + 1}
                    animate={shouldAnimate}
                    isAuthenticated={isAuthenticated}
                    query={query}
                    isRead={readStoryIds.has(story.id)}
                  />
                ))}
              </div>

              {/* Индикатор загрузки следующих историй */}
              {loadingMore && (
                <div className="flex justify-center items-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 border-4 border-[#abd1c6] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#abd1c6] font-medium">
                      Загружаем ещё истории...
                    </p>
                  </div>
                </div>
              )}

              {/* Невидимый элемент для отслеживания скролла */}
              {hasMore && !loadingMore && (
                <div ref={observerTargetRef} className="h-20" />
              )}

              {/* Сообщение о конце списка */}
              {!hasMore && stories.length > 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#abd1c6]/50 hover:shadow-lg hover:shadow-[#abd1c6]/20 cursor-default">
                    <p className="text-[#abd1c6] font-medium transition-all duration-300 hover:text-[#f9bc60]">
                      А всё!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
