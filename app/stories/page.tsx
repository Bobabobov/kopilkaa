"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  StoriesHeader,
  StoryCard,
  AdCard,
  StoriesLoading,
  StoriesEmptyState,
} from "@/components/stories";
import PixelBackground from "@/components/ui/PixelBackground";

interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: Array<{ url: string; sort: number }>;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  _count: {
    likes: number;
  };
}

export default function StoriesPage() {
  const [query, setQuery] = useState("");
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const previousQuery = useRef("");

  // Загрузка историй
  const loadStories = useCallback(async (page: number, isNewSearch = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(query && { q: query }),
      });

      const response = await fetch(`/api/stories?${params}`);
      if (response.ok) {
        const data = await response.json();
        const newStories = data.items || [];
        
        if (isNewSearch || page === 1) {
          // При новом поиске - заменяем истории
          setStories(newStories);
        } else {
          // При подгрузке - добавляем к существующим
          setStories(prev => [...prev, ...newStories]);
        }
        
        // Проверяем, есть ли ещё страницы
        setHasMore(page < (data.pages || 1));
      } else {
        console.error("Failed to load stories");
        if (page === 1) {
          setStories([]);
        }
      }
    } catch (error) {
      console.error("Error loading stories:", error);
      if (page === 1) {
        setStories([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query]);

  // Загрузка при изменении поиска
  useEffect(() => {
    const isNewSearch = query !== previousQuery.current;
    previousQuery.current = query;
    
    if (isNewSearch) {
      setCurrentPage(1);
      setHasMore(true);
      loadStories(1, true);
    }
  }, [query, loadStories]);

  // Загрузка при первом рендере
  useEffect(() => {
    loadStories(1, true);
  }, []);

  // Intersection Observer для бесконечной прокрутки
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          const nextPage = currentPage + 1;
          setCurrentPage(nextPage);
          loadStories(nextPage, false);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadingMore, hasMore, currentPage, loading, loadStories]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="min-h-screen">
      {/* Пиксельный фон */}
      <PixelBackground />

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
                  <StoryCard key={story.id} story={story} index={index + 1} />
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
                <div ref={observerTarget} className="h-20" />
              )}

              {/* Сообщение о конце списка */}
              {!hasMore && stories.length > 0 && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:bg-white/10 hover:border-[#abd1c6]/50 hover:shadow-lg hover:shadow-[#abd1c6]/20 cursor-default">
                    <p className="text-[#abd1c6] font-medium transition-all duration-300 hover:text-[#f9bc60]">
                      А всё, ноу историй!
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
