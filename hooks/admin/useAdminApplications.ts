// app/admin/hooks/useAdminApplications.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ApplicationItem, Stats } from '@/types/admin';
import { getMessageFromApiJson } from '@/lib/api/parseApiError';

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

interface UseAdminApplicationsProps {
  initialPage?: number;
  initialStatus?: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface UseAdminApplicationsReturn {
  items: ApplicationItem[];
  isSearchPending: boolean;
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  totalPages: number;
  stats: Stats | null;

  q: string;
  setQ: (query: string) => void;
  status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
  setStatus: (status: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => void;
  minAmount: string;
  setMinAmount: (amount: string) => void;
  maxAmount: string;
  setMaxAmount: (amount: string) => void;
  sortBy: 'date' | 'amount' | 'status';
  setSortBy: (sort: 'date' | 'amount' | 'status') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;

  setPage: (page: number) => void;
  refreshStats: () => Promise<void>;
  refreshApplications: () => Promise<void>;
  toggleEmail: (id: string) => void;
  visibleEmails: Set<string>;
}

function buildListParams(
  page: number,
  debouncedQ: string,
  status: UseAdminApplicationsReturn['status'],
  minAmount: string,
  maxAmount: string,
  sortBy: UseAdminApplicationsReturn['sortBy'],
  sortOrder: UseAdminApplicationsReturn['sortOrder'],
): URLSearchParams {
  return new URLSearchParams({
    page: page.toString(),
    limit: String(PAGE_SIZE),
    ...(debouncedQ && { q: debouncedQ }),
    ...(status !== 'ALL' && { status }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });
}

export function useAdminApplications({
  initialPage = 1,
  initialStatus = 'ALL',
}: UseAdminApplicationsProps = {}): UseAdminApplicationsReturn {
  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [status, setStatus] = useState<
    'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  >(initialStatus);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [page, setPageState] = useState(initialPage);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visibleEmails, setVisibleEmails] = useState<Set<string>>(new Set());
  const [canStream, setCanStream] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchGenerationRef = useRef(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pageRef = useRef(page);

  const isSearchPending = q.trim() !== debouncedQ.trim();

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQ(q.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [q]);

  const fetchApplications = useCallback(
    async (targetPage: number) => {
      const generation = ++fetchGenerationRef.current;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        setLoading(true);
        setError(null);

        const params = buildListParams(
          targetPage,
          debouncedQ,
          status,
          minAmount,
          maxAmount,
          sortBy,
          sortOrder,
        );

        const response = await fetch(`/api/admin/applications?${params}`, {
          cache: 'no-store',
          signal: abortController.signal,
        });

        if (abortController.signal.aborted) return;
        if (generation !== fetchGenerationRef.current) return;

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            getMessageFromApiJson(data, 'Не удалось загрузить список заявок'),
          );
        }

        if (generation !== fetchGenerationRef.current) return;

        const newItems: ApplicationItem[] = data?.items || [];
        const pages = Math.max(1, data?.pages || 1);
        const resolvedPage = Math.min(targetPage, pages);

        setItems(newItems);
        setTotal(data?.total ?? newItems.length);
        setTotalPages(pages);
        setPageState(resolvedPage);

        if (resolvedPage !== targetPage && generation === fetchGenerationRef.current) {
          void fetchApplications(resolvedPage);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (generation !== fetchGenerationRef.current) return;
        console.error('Failed to load applications:', err);
        setError(
          err instanceof Error ? err.message : 'Ошибка загрузки заявок',
        );
        setItems([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        if (generation === fetchGenerationRef.current) {
          setLoading(false);
        }
      }
    },
    [debouncedQ, status, minAmount, maxAmount, sortBy, sortOrder],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      const safePage = Math.max(1, Math.min(nextPage, totalPages || 1));
      if (safePage === pageRef.current) return;
      setPageState(safePage);
      void fetchApplications(safePage);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [fetchApplications, totalPages],
  );

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/stats');
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
      console.error('Failed to load stats:', err);
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
      void fetchApplications(pageRef.current);
    }, 50);
  }, [fetchApplications]);

  // Фильтры и поиск — сброс на первую страницу
  useEffect(() => {
    setPageState(1);
    void fetchApplications(1);
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

      const eventSource = new EventSource('/api/admin/stream');
      eventSourceRef.current = eventSource;

      eventSource.addEventListener('application:update', () => {
        refreshApplications();
      });
      eventSource.addEventListener('application:created', () => {
        refreshApplications();
      });
      eventSource.addEventListener('application:delete', () => {
        refreshApplications();
      });
      eventSource.addEventListener('stats:dirty', () => {
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
    isSearchPending,
    loading,
    error,
    page,
    total,
    totalPages,
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
    setPage,
    refreshStats,
    refreshApplications,
    toggleEmail,
    visibleEmails,
  };
}
