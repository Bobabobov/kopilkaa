// hooks/stories/useStories.ts
import { useState, useEffect, useRef, useCallback } from "react";

export interface Story {
  id: string;
  title: string;
  summary: string;
  createdAt: string;
  images: Array<{ url: string; sort: number }>;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    hideEmail?: boolean;
  };
  _count: {
    likes: number;
  };
  userLiked?: boolean;
}

interface StoriesResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: Story[];
}

interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  query: string;
  setQuery: (query: string) => void;
  loadNextPage: () => void;
  resetAndSearch: (newQuery: string) => void;
  observerTargetRef: React.RefObject<HTMLDivElement | null>;
  isInitialLoad: boolean; // Флаг первой загрузки для анимаций
}

export function useStories(): UseStoriesReturn {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const observerTargetRef = useRef<HTMLDivElement>(null);
  
  // Отслеживание предыдущего запроса для корректного debounce
  const previousQueryRef = useRef("");
  // Флаг для отслеживания первой загрузки (для анимаций)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // AbortController для отмены устаревших запросов
  const abortControllerRef = useRef<AbortController | null>(null);

  // Загрузка историй с защитой от race conditions
  const loadStories = useCallback(async (page: number, searchQuery: string, isNewSearch: boolean) => {
    // НЕ используем AbortController для первой загрузки - это предотвращает отмену запросов
    // Используем AbortController только для пагинации (page > 1)
    let abortController: AbortController | null = null;
    
    if (page > 1) {
      // Отменяем предыдущий запрос только при пагинации
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        abortControllerRef.current.abort();
      }
      abortController = new AbortController();
      abortControllerRef.current = abortController;
    }

    try {
      if (page === 1) {
        setLoading(true);
        setIsInitialLoad(isNewSearch);
      } else {
        setLoadingMore(true);
        setIsInitialLoad(false); // При подгрузке это уже не первая загрузка
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(searchQuery && { q: searchQuery }),
      });

      const url = `/api/stories?${params}`;
      
      let response: Response;
      try {
        response = await fetch(url, {
          cache: "no-store",
          ...(abortController && { signal: abortController.signal }),
        });
      } catch (fetchError: any) {
        // Обрабатываем ошибки сети
        if (fetchError.name === "AbortError") {
          return;
        }
        console.error("[useStories] Network error:", fetchError);
        if (page === 1) {
          setStories([]);
        }
        return;
      }

      // Проверяем, не был ли запрос отменён (только если используется AbortController)
      if (abortController && abortController.signal.aborted) {
        return;
      }

      if (response.ok) {
        let data: StoriesResponse;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("[useStories] JSON parse error:", jsonError);
          if (page === 1) {
            setStories([]);
          }
          return;
        }

        const newStories = data.items || [];

        // Отладочное логирование (можно убрать в production)
        if (process.env.NODE_ENV === "development") {
          console.log("[useStories] Loaded stories:", {
            page,
            count: newStories.length,
            total: data.total,
            pages: data.pages,
          });
        }

        // Проверяем, не был ли запрос отменён после получения данных
        if (abortController && abortController.signal.aborted) {
          return;
        }

        if (isNewSearch || page === 1) {
          // При новом поиске - заменяем истории
          setStories(newStories);
        } else {
          // При подгрузке - добавляем к существующим
          setStories((prev) => [...prev, ...newStories]);
        }

        // Проверяем, есть ли ещё страницы
        setHasMore(page < (data.pages || 1));
        setCurrentPage(page);
      } else {
        console.error("[useStories] Failed to load stories:", response.status, response.statusText);
        // Пытаемся прочитать тело ответа для дополнительной информации
        try {
          const errorData = await response.text();
          console.error("[useStories] Error response:", errorData);
        } catch (e) {
          // Игнорируем ошибки чтения тела ответа
        }
        if (page === 1) {
          setStories([]);
        }
      }
    } catch (error: any) {
      // Игнорируем ошибки отменённых запросов
      if (error.name === "AbortError") {
        return;
      }
      console.error("Error loading stories:", error);
      if (page === 1) {
        setStories([]);
      }
    } finally {
      // Обновляем состояние только если запрос не был отменён
      if (!abortController || !abortController.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []); // Пустой массив зависимостей - функция стабильна

  // Загрузка следующей страницы
  const loadNextPage = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = currentPage + 1;
      loadStories(nextPage, query, false);
    }
  }, [currentPage, query, hasMore, loading, loadingMore, loadStories]);

  // Сброс и новый поиск
  const resetAndSearch = useCallback((newQuery: string) => {
    const isNewSearch = newQuery !== previousQueryRef.current;
    previousQueryRef.current = newQuery;
    
    if (isNewSearch) {
      setCurrentPage(1);
      setHasMore(true);
      setStories([]);
      loadStories(1, newQuery, true);
    }
  }, [loadStories]);

  // Флаг для отслеживания первоначальной загрузки
  const hasInitializedRef = useRef(false);

  // Обработка первоначальной загрузки и изменений поискового запроса
  useEffect(() => {
    // Первоначальная загрузка (только один раз)
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousQueryRef.current = query;
      loadStories(1, query, true);
      return;
    }

    // Обработка изменения поискового запроса
    const isNewSearch = query !== previousQueryRef.current;
    
    if (isNewSearch) {
      previousQueryRef.current = query;
      setCurrentPage(1);
      setHasMore(true);
      setStories([]);
      loadStories(1, query, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // Зависимость только от query

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    stories,
    loading,
    loadingMore,
    hasMore,
    query,
    setQuery,
    loadNextPage,
    resetAndSearch,
    observerTargetRef,
    isInitialLoad,
  };
}


