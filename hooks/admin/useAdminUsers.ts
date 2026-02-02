"use client";

import { useState, useEffect, useRef } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import type { AdminUser } from "@/types/admin";
import { getTrustLevelFromEffectiveApproved } from "@/lib/trustLevel";

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [trustDeltaSaving, setTrustDeltaSaving] = useState<string | null>(null);
  const { showToast } = useBeautifulToast();
  const { confirm } = useBeautifulNotifications();
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUsers(1, true);
  }, [searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
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
  }, [loadingMore, hasMore, loading]);

  const loadUsers = async (page: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setUsers([]);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(searchQuery && { q: searchQuery }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки пользователей");
      }
      const data = await response.json();
      if (data.success) {
        const newUsers = data.data || [];
        if (reset) {
          setUsers(newUsers);
        } else {
          setUsers((prev) => [...prev, ...newUsers]);
        }
        setHasMore(page < (data.pages || 1));
        setCurrentPage(page + 1);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      showToast("error", "Ошибка", "Не удалось загрузить список пользователей");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      loadUsers(currentPage, false);
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
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
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

  const updateUserTrust = (
    userId: string,
    nextDelta: number,
    effectiveApproved: number,
  ) => {
    setUsers((prev) =>
      prev.map((it) =>
        it.id === userId
          ? {
              ...it,
              trustDelta: nextDelta,
              trustLevel: getTrustLevelFromEffectiveApproved(
                effectiveApproved,
                nextDelta,
              ),
            }
          : it,
      ),
    );
  };

  return {
    users,
    loading,
    loadingMore,
    hasMore,
    searchQuery,
    setSearchQuery,
    observerTarget,
    deletingUserId,
    handleDeleteUser,
    trustDeltaSaving,
    setTrustDeltaSaving,
    updateUserTrust,
    showToast,
  };
}
