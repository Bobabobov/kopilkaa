// hooks/stories/useStories.ts
import { useState, useEffect, useRef, useCallback } from "react";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

export interface Story {
  id: string;
  title: string;
  summary: string;
  amount: number;
  createdAt: string;
  isContestWinner?: boolean;
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

export type StoriesSort = "newest" | "oldest" | "popular";

interface UseStoriesOptions {
  initialStories?: Story[];
  initialStoriesHasMore?: boolean;
}

interface UseStoriesReturn {
  stories: Story[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  currentPage: number;
  query: string;
  setQuery: (query: string) => void;
  sort: StoriesSort;
  setSort: (sort: StoriesSort) => void;
  loadNextPage: () => void;
  resetAndSearch: (newQuery: string) => void;
  observerTargetRef: React.RefObject<HTMLDivElement | null>;
  isInitialLoad: boolean;
}

export function useStories(options: UseStoriesOptions = {}): UseStoriesReturn {
  const { initialStories = [], initialStoriesHasMore = true } = options;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [sort, setSort] = useState<StoriesSort>("newest");
  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Отслеживание предыдущего запроса для корректного debounce
  const previousQueryRef = useRef("");
  const previousSortRef = useRef<StoriesSort>(sort);
  // Флаг для отслеживания первой загрузки (для анимаций)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // AbortController для отмены устаревших запросов
  const abortControllerRef = useRef<AbortController | null>(null);

  // Загрузка историй с защитой от race conditions
  const loadStories = useCallback(
    async (
      page: number,
      searchQuery: string,
      sortMode: StoriesSort,
      isNewSearch: boolean,
    ) => {
      // НЕ используем AbortController для первой загрузки - это предотвращает отмену запросов
      // Используем AbortController только для пагинации (page > 1)
      let abortController: AbortController | null = null;

      if (page > 1) {
        // Отменяем предыдущий запрос только при пагинации
        if (
          abortControllerRef.current &&
          !abortControllerRef.current.signal.aborted
        ) {
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
          ...(sortMode !== "newest" && { sort: sortMode }),
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
          const errorBody = await response.json().catch(() => null);
          console.error(
            "[useStories] Failed to load stories:",
            getMessageFromApiJson(
              errorBody,
              `${response.status} ${response.statusText || ""}`.trim(),
            ),
          );
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
    },
    [],
  ); // Пустой массив зависимостей - функция стабильна

  // Загрузка следующей страницы
  const loadNextPage = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      const nextPage = currentPage + 1;
      loadStories(nextPage, query, sort, false);
    }
  }, [currentPage, query, sort, hasMore, loading, loadingMore, loadStories]);

  // Сброс и новый поиск
  const resetAndSearch = useCallback(
    (newQuery: string) => {
      const isNewSearch = newQuery !== previousQueryRef.current;
      previousQueryRef.current = newQuery;

      if (isNewSearch) {
        setCurrentPage(1);
        setHasMore(true);
        setStories([]);
        loadStories(1, newQuery, sort, true);
      }
    },
    [loadStories, sort],
  );

  // Флаг для отслеживания первоначальной загрузки
  const hasInitializedRef = useRef(false);

  // Дебаунс для поискового запроса
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => clearTimeout(handle);
  }, [query]);

  // Обработка первоначальной загрузки и изменений поискового запроса / сортировки
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousQueryRef.current = debouncedQuery;
      previousSortRef.current = sort;

      // Первая страница уже с сервера — не дублируем запрос (только при дефолтной сортировке)
      if (
        initialStories.length > 0 &&
        debouncedQuery === "" &&
        sort === "newest"
      ) {
        setStories(initialStories);
        setLoading(false);
        setCurrentPage(1);
        setHasMore(initialStoriesHasMore);
        setIsInitialLoad(true);
        return;
      }

      loadStories(1, debouncedQuery, sort, true);
      return;
    }

    const isNewSearch = debouncedQuery !== previousQueryRef.current;
    const isNewSort = sort !== previousSortRef.current;

    if (isNewSort) {
      previousSortRef.current = sort;
      setCurrentPage(1);
      setHasMore(true);
      setStories([]);
      loadStories(1, debouncedQuery, sort, true);
      return;
    }

    if (isNewSearch) {
      previousQueryRef.current = debouncedQuery;
      setCurrentPage(1);
      setHasMore(true);
      setStories([]);
      loadStories(1, debouncedQuery, sort, true);
    }
  }, [
    debouncedQuery,
    sort,
    loadStories,
    initialStories.length,
    initialStoriesHasMore,
  ]);

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
    currentPage,
    query,
    setQuery,
    sort,
    setSort,
    loadNextPage,
    resetAndSearch,
    observerTargetRef,
    isInitialLoad,
  };
}
