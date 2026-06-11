// app/admin/hooks/useAdminApplications.ts
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { ApplicationItem, Stats } from "@/types/admin";
import { applicationMatchesClientSearch } from "@/lib/admin/applicationSearch";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

interface UseAdminApplicationsProps {
  initialPage?: number;
}

interface UseAdminApplicationsReturn {
  items: ApplicationItem[];
  /** Список с мгновенной клиентской фильтрацией при вводе */
  displayItems: ApplicationItem[];
  isSearchPending: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  stats: Stats | null;

  q: string;
  setQ: (query: string) => void;
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  setStatus: (
    status: "ALL" | "PENDING" | "APPROVED" | "REJECTED",
  ) => void;
  minAmount: string;
  setMinAmount: (amount: string) => void;
  maxAmount: string;
  setMaxAmount: (amount: string) => void;
  sortBy: "date" | "amount" | "status";
  setSortBy: (sort: "date" | "amount" | "status") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;

  loadMore: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  toggleEmail: (id: string) => void;
  visibleEmails: Set<string>;
}

const SEARCH_DEBOUNCE_MS = 300;

function buildListParams(
  page: number,
  debouncedQ: string,
  status: UseAdminApplicationsReturn["status"],
  minAmount: string,
  maxAmount: string,
  sortBy: UseAdminApplicationsReturn["sortBy"],
  sortOrder: UseAdminApplicationsReturn["sortOrder"],
): URLSearchParams {
  return new URLSearchParams({
    page: page.toString(),
    limit: "20",
    ...(debouncedQ && { q: debouncedQ }),
    ...(status !== "ALL" && { status }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });
}

export function useAdminApplications({
  initialPage = 1,
}: UseAdminApplicationsProps = {}): UseAdminApplicationsReturn {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visibleEmails, setVisibleEmails] = useState<Set<string>>(new Set());
  const [canStream, setCanStream] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchGenerationRef = useRef(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const isSearchPending = q.trim() !== debouncedQ.trim();

  const displayItems = useMemo(() => {
    const query = q.trim();
    if (!query) return items;
    return items.filter((item) => applicationMatchesClientSearch(item, query));
  }, [items, q]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQ(q.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [q]);

  const fetchApplications = useCallback(
    async (page: number, replace: boolean) => {
      const generation = ++fetchGenerationRef.current;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError(null);

        const params = buildListParams(
          page,
          debouncedQ,
          status,
          minAmount,
          maxAmount,
          sortBy,
          sortOrder,
        );

        const response = await fetch(`/api/admin/applications?${params}`, {
          cache: "no-store",
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;
        if (generation !== fetchGenerationRef.current) return;

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(data, "Не удалось загрузить список заявок"),
          );
        }

        const newItems: ApplicationItem[] = data?.items || [];

        if (generation !== fetchGenerationRef.current) return;

        if (page === 1) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        setHasMore(page < (data?.pages || 1));
        setCurrentPage(page + 1);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        if (generation !== fetchGenerationRef.current) return;
        console.error("Failed to load applications:", err);
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки заявок",
        );
        if (page === 1) {
          setItems([]);
        }
      } finally {
        if (generation === fetchGenerationRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [debouncedQ, status, minAmount, maxAmount, sortBy, sortOrder],
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    const page = currentPage;
    await fetchApplications(page, false);
  }, [loading, loadingMore, hasMore, currentPage, fetchApplications]);

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.status === 401 || response.status === 403) {
        setCanStream(false);
        return;
      }
      if (response.ok) {
        setCanStream(true);
        const data = await response.json();
        if (data.success && data.data?.applications) {
          setStats({
            pending: data.data.applications.pending,
            approved: data.data.applications.approved,
            rejected: data.data.applications.rejected,
            total: data.data.applications.total,
            totalAmount: data.data.applications.totalAmount,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load stats:", err);
      setCanStream(false);
    }
  }, []);

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

  const refreshApplications = useCallback(async () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    refreshTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      setHasMore(true);
      void fetchApplications(1, true);
    }, 50);
  }, [fetchApplications]);

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    void fetchApplications(1, true);
  }, [debouncedQ, status, minAmount, maxAmount, sortBy, sortOrder, fetchApplications]);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  useEffect(() => {
    if (!canStream) return;

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

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [refreshApplications, refreshStats, canStream]);

  return {
    items,
    displayItems,
    isSearchPending,
    loading,
    loadingMore,
    error,
    currentPage,
    hasMore,
    stats,
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
    loadMore,
    refreshStats,
    refreshApplications,
    toggleEmail,
    visibleEmails,
  };
}
