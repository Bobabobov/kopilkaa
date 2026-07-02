"use client";

import { useState, useEffect, useCallback } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import type { AdminUser } from "@/types/admin";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 300;

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPageState] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const { showToast } = useBeautifulToast();
  const { confirm } = useBeautifulNotifications();

  const isSearchPending = searchQuery.trim() !== debouncedQ.trim();

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQ(searchQuery.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchQuery]);

  useEffect(() => {
    setPageState(1);
  }, [debouncedQ]);

  const loadUsers = useCallback(
    async (targetPage: number) => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: targetPage.toString(),
          limit: String(PAGE_SIZE),
          withLinks: "1",
          ...(debouncedQ && { q: debouncedQ }),
        });

        const response = await fetch(`/api/admin/users?${params}`);
        if (!response.ok) {
          throw new Error("Ошибка загрузки пользователей");
        }
        const data = await response.json();
        if (data.success) {
          setUsers(data.data || []);
          setTotal(typeof data.total === "number" ? data.total : 0);
          setTotalPages(Math.max(1, data.pages || 1));
        }
      } catch (error) {
        console.error("Failed to load users:", error);
        showToast("error", "Ошибка", "Не удалось загрузить список пользователей");
      } finally {
        setLoading(false);
      }
    },
    [debouncedQ, showToast],
  );

  useEffect(() => {
    loadUsers(page);
  }, [page, loadUsers]);

  const setPage = (nextPage: number) => {
    const clamped = Math.max(1, Math.min(totalPages, nextPage));
    setPageState(clamped);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const agreed = await confirm(
      `Вы уверены, что хотите удалить пользователя "${userName}"? Это действие нельзя отменить.`,
      "Удаление пользователя",
    );

    if (!agreed) return;

    try {
      setDeletingUserId(userId);
      const response = await fetch(`/api/admin/users/${userId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showToast(
          "success",
          "Пользователь удалён",
          "Аккаунт удалён из системы",
        );
        const remainingOnPage = users.filter((u) => u.id !== userId).length;
        setTotal((prev) => Math.max(0, prev - 1));
        if (remainingOnPage === 0 && page > 1) {
          setPageState(page - 1);
        } else {
          await loadUsers(page);
        }
      } else {
        showToast(
          "error",
          "Ошибка",
          data.message || "Не удалось удалить пользователя",
        );
      }
    } catch (error) {
      console.error("Delete user error:", error);
      showToast("error", "Ошибка", "Не удалось удалить пользователя");
    } finally {
      setDeletingUserId(null);
    }
  };

  return {
    users,
    total,
    totalPages,
    page,
    setPage,
    loading,
    isSearchPending,
    searchQuery,
    setSearchQuery,
    deletingUserId,
    handleDeleteUser,
    showToast,
  };
}
