"use client";

import { useEffect, useState } from "react";
import {
  StoriesHeader,
  StoryCard,
  AdCard,
  StoriesLoading,
  StoriesEmptyState,
} from "@/components/stories";
import { useStories } from "@/hooks/stories/useStories";

export default function StoriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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
      { threshold: 0.1, rootMargin: "100px" }
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

  const hasQuery = query.trim().length > 0;
  // Анимируем карточки только при первой загрузке (не при подгрузке следующих страниц)
  const shouldAnimate = isInitialLoad && !loading;

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
