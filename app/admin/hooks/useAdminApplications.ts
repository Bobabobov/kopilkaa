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
  error: string | null;
  page: number;
  pages: number;
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
  load: (pageNum?: number) => Promise<void>;
  setPage: (pageNum: number) => void;
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
  const [page, setPage] = useState(initialPage);
  const [pages, setPages] = useState(1);
  const [items, setItems] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [visibleEmails, setVisibleEmails] = useState<Set<string>>(new Set());

  // Загрузка данных
  const load = useCallback(
    async (p = 1) => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: p.toString(),
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
        setItems(data.items || []);
        setPages(data.pages || 1);
        setPage(p);
      } catch (err) {
        console.error("Failed to load applications:", err);
        setError("Ошибка загрузки заявок");
      } finally {
        setLoading(false);
      }
    },
    [q, status, minAmount, maxAmount, sortBy, sortOrder],
  );

  // Загрузка статистики
  const refreshStats = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
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

  // Загрузка при изменении фильтров
  useEffect(() => {
    load(1);
  }, [load]);

  // Загрузка статистики при монтировании
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  return {
    // Состояние
    items,
    loading,
    error,
    page,
    pages,
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
    load,
    setPage,
    refreshStats,
    toggleEmail,
    visibleEmails,
  };
}
