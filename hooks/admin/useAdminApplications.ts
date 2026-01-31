// app/admin/hooks/useAdminApplications.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ApplicationItem, Stats } from "@/types/admin";

interface UseAdminApplicationsProps {
  initialPage?: number;
}

interface UseAdminApplicationsReturn {
  // Состояние
  items: ApplicationItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  stats: Stats | null;

  // Фильтры
  q: string;
  setQ: (query: string) => void;
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "CONTEST";
  setStatus: (
    status: "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "CONTEST",
  ) => void;
  minAmount: string;
  setMinAmount: (amount: string) => void;
  maxAmount: string;
  setMaxAmount: (amount: string) => void;
  sortBy: "date" | "amount" | "status";
  setSortBy: (sort: "date" | "amount" | "status") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;

  // Действия
  loadMore: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  toggleEmail: (id: string) => void;
  visibleEmails: Set<string>;
}

export function useAdminApplications({
  initialPage = 1,
}: UseAdminApplicationsProps = {}): UseAdminApplicationsReturn {
  // Фильтры/поиск
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "CONTEST"
  >("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Список
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visibleEmails, setVisibleEmails] = useState<Set<string>>(new Set());

  // Загрузка данных. При смене фильтров передать 1, чтобы запросить первую страницу.
  const loadMore = useCallback(
    async (overridePage?: number) => {
      const page = overridePage ?? currentPage;
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: "20",
          ...(q && { q }),
          ...(status !== "ALL" && { status }),
          ...(minAmount && { minAmount }),
          ...(maxAmount && { maxAmount }),
          ...(sortBy && { sortBy }),
          ...(sortOrder && { sortOrder }),
        });

        const response = await fetch(`/api/admin/applications?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newItems = data.items || [];

        if (page === 1) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        setHasMore(page < (data.pages || 1));
        setCurrentPage(page + 1);
      } catch (err) {
        console.error("Failed to load applications:", err);
        setError("Ошибка загрузки заявок");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [currentPage, q, status, minAmount, maxAmount, sortBy, sortOrder],
  );

  // Загрузка статистики
  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.applications) {
          // Преобразуем структуру данных в ожидаемый формат
          setStats({
            pending: data.data.applications.pending,
            approved: data.data.applications.approved,
            rejected: data.data.applications.rejected,
            contest: data.data.applications.contest ?? 0,
            total: data.data.applications.total,
            totalAmount: data.data.applications.totalAmount,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }, []);

  // Переключение видимости email
  const toggleEmail = useCallback((id: string) => {
    setVisibleEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Debounced обновление для избежания множественных запросов
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Обновление списка заявок (перезагрузка первой страницы)
  const refreshApplications = useCallback(async () => {
    // Отменяем предыдущее обновление, если оно еще не выполнилось
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(async () => {
      try {
        setError(null);

        // Не показываем loading если это быстрое обновление через SSE
        const isQuickRefresh = items.length > 0;
        if (!isQuickRefresh) {
          setLoading(true);
        }

        setCurrentPage(1);

        const params = new URLSearchParams({
          page: "1",
          limit: "20",
          ...(q && { q }),
          ...(status !== "ALL" && { status }),
          ...(minAmount && { minAmount }),
          ...(maxAmount && { maxAmount }),
          ...(sortBy && { sortBy }),
          ...(sortOrder && { sortOrder }),
        });

        const response = await fetch(`/api/admin/applications?${params}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newItems = data.items || [];

        setItems(newItems);
        setHasMore(1 < (data.pages || 1));
        setCurrentPage(2);
      } catch (err) {
        console.error("Failed to refresh applications:", err);
        setError("Ошибка обновления заявок");
      } finally {
        setLoading(false);
      }
    }, 50);
  }, [q, status, minAmount, maxAmount, sortBy, sortOrder, items.length]);

  // Загрузка при изменении фильтров — всегда запрашиваем страницу 1
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    loadMore(1);
  }, [q, status, minAmount, maxAmount, sortBy, sortOrder]);

  // Загрузка статистики при монтировании
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  // SSE подключение для real-time обновлений
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Подключаемся к SSE
    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource("/api/admin/stream");
      eventSourceRef.current = eventSource;

      eventSource.addEventListener("application:update", () => {
        refreshApplications();
      });

      eventSource.addEventListener("application:created", () => {
        refreshApplications();
      });

      eventSource.addEventListener("application:delete", () => {
        refreshApplications();
      });

      eventSource.addEventListener("stats:dirty", () => {
        refreshStats();
      });

      eventSource.onerror = () => {
        eventSource.close();
        setTimeout(connectSSE, 3000);
      };
    };

    connectSSE();

    // Очистка при размонтировании
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [refreshApplications, refreshStats]);

  return {
    // Состояние
    items,
    loading,
    loadingMore,
    error,
    currentPage,
    hasMore,
    stats,

    // Фильтры
    q,
    setQ,
    status,
    setStatus,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,

    // Действия
    loadMore,
    refreshStats,
    refreshApplications,
    toggleEmail,
    visibleEmails,
  };
}
