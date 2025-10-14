// app/admin/hooks/useAdminApplications.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { ApplicationItem, Stats, ApplicationStatus } from "../types";

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
  status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
  setStatus: (status: "ALL" | "PENDING" | "APPROVED" | "REJECTED") => void;
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
  refreshStats: () => void;
  toggleEmail: (id: string) => void;
  visibleEmails: Set<string>;
}

export function useAdminApplications({
  initialPage = 1,
}: UseAdminApplicationsProps = {}): UseAdminApplicationsReturn {
  // Фильтры/поиск
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
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

  // Загрузка данных
  const loadMore = useCallback(async () => {
    try {
      if (currentPage === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
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
      
      if (currentPage === 1) {
        // При первой загрузке или новом поиске - заменяем данные
        setItems(newItems);
      } else {
        // При подгрузке - добавляем к существующим
        setItems(prev => [...prev, ...newItems]);
      }
      
      // Проверяем, есть ли ещё страницы
      setHasMore(currentPage < (data.pages || 1));
      
      // Переходим на следующую страницу для следующей загрузки
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      console.error("Failed to load applications:", err);
      setError("Ошибка загрузки заявок");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentPage, q, status, minAmount, maxAmount, sortBy, sortOrder]);

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

  // Загрузка при изменении фильтров (сброс на первую страницу)
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    loadMore();
  }, [q, status, minAmount, maxAmount, sortBy, sortOrder]);

  // Загрузка статистики при монтировании
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

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
    toggleEmail,
    visibleEmails,
  };
}
