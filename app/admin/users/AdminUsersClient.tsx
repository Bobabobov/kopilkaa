"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AdminHeader } from "../components/AdminHeader";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { useBeautifulNotifications } from "@/components/ui/BeautifulNotificationsProvider";
import Link from "next/link";

interface User {
  id: string;
  email: string | null;
  name: string | null;
  avatar: string | null;
  createdAt: string;
  lastSeen: string | null;
  role: string;
}

export default function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Никогда";
    return new Date(dateString).toLocaleString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const agreed = await confirm(
      `Вы уверены, что хотите удалить пользователя "${userName}"? Это действие нельзя отменить.`,
      "Удаление пользователя"
    );
    
    if (!agreed) return;

    try {
      setDeletingUserId(userId);
      const response = await fetch(`/api/admin/users/${userId}/delete`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        showToast("success", "Пользователь удалён", "Аккаунт удалён из системы");
        // Удаляем пользователя из списка
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        showToast("error", "Ошибка", data.message || "Не удалось удалить пользователя");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      showToast("error", "Ошибка", "Не удалось удалить пользователя");
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="min-h-screen relative">

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
          <AdminHeader />

          {/* Заголовок и поиск */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#fffffe] mb-2">
                  👥 Все пользователи
                </h2>
                <p className="text-[#abd1c6] text-sm sm:text-base">
                  Загружено: {users.length} {hasMore && "(ещё загружается...)"}
                </p>
              </div>

              {/* Поиск */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Поиск по имени или email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 bg-[#001e1d] border border-[#abd1c6]/20 rounded-xl text-[#fffffe] placeholder-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60] focus:ring-2 focus:ring-[#f9bc60]/20"
                />
              </div>
            </div>
          </motion.div>

          {/* Список пользователей */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-[#abd1c6]">Загрузка пользователей...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <LucideIcons.Users className="w-16 h-16 mx-auto mb-4 text-[#abd1c6]/50" />
              <p className="text-[#abd1c6]">
                {searchQuery ? "Пользователи не найдены" : "Нет пользователей"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-br from-[#001e1d] to-[#003d3a] rounded-xl p-4 sm:p-6 border border-[#abd1c6]/20 hover:border-[#f9bc60]/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Аватар */}
                    <div className="w-12 h-12 rounded-full bg-[#f9bc60]/20 flex items-center justify-center flex-shrink-0 border border-[#f9bc60]/30">
                      <span className="text-[#f9bc60] text-lg font-bold">
                        {(user.name || user.email || "П")[0].toUpperCase()}
                      </span>
                    </div>

                    {/* Информация */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/profile/${user.id}`}
                        className="block hover:underline"
                      >
                        <h3 className="text-[#fffffe] font-semibold mb-1 truncate">
                          {user.name || (user.email ? user.email.split("@")[0] : "Пользователь")}
                        </h3>
                      </Link>
                      
                      {user.email && (
                        <p className="text-[#abd1c6] text-sm mb-2 truncate">
                          {user.email}
                        </p>
                      )}

                      <div className="space-y-1 text-xs text-[#abd1c6]/70">
                        <div className="flex items-center gap-1">
                          <LucideIcons.Calendar className="w-3 h-3" />
                          <span>Регистрация: {formatDate(user.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <LucideIcons.Clock className="w-3 h-3" />
                          <span>Был онлайн: {formatDateTime(user.lastSeen)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Link
                          href={`/profile/${user.id}`}
                          className="inline-flex items-center gap-1 text-xs text-[#f9bc60] hover:text-[#f9bc60]/80 transition-colors"
                        >
                          <span>Открыть профиль</span>
                          <LucideIcons.ArrowRight className="w-3 h-3" />
                        </Link>
                        
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name || user.email || "Пользователь")}
                          disabled={deletingUserId === user.id || user.role === "ADMIN"}
                          className="ml-auto inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user.role === "ADMIN" ? "Нельзя удалить администратора" : "Удалить пользователя"}
                        >
                          {deletingUserId === user.id ? (
                            <>
                              <LucideIcons.Loader2 className="w-3 h-3 animate-spin" />
                              <span>Удаление...</span>
                            </>
                          ) : (
                            <>
                              <LucideIcons.Trash2 className="w-3 h-3" />
                              <span>Удалить</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>

              {/* Индикатор загрузки */}
              {loadingMore && (
                <div className="text-center py-8">
                  <div className="inline-block w-6 h-6 border-3 border-[#f9bc60] border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-[#abd1c6] text-sm">Загрузка...</p>
                </div>
              )}

              {/* Невидимый элемент для отслеживания скролла */}
              {hasMore && !loadingMore && (
                <div ref={observerTarget} className="h-20" />
              )}

              {/* Сообщение о конце списка */}
              {!hasMore && users.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-[#abd1c6] text-sm">Все пользователи загружены</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

