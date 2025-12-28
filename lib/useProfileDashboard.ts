"use client";
import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  avatar?: string | null;
  headerTheme?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  createdAt: string;
  lastSeen?: string | null;
}

interface Friend {
  id: string;
  status: string;
  createdAt: string;
  requesterId: string;
  receiverId: string;
  requester: User;
  receiver: User;
}

interface Achievement {
  id: string;
  unlockedAt: string;
  grantedBy?: string | null;
  grantedByName?: string | null;
  achievement: {
    id: string;
    name: string;
    description: string;
    rarity: string;
  };
}

interface Stats {
  totalApplications: number;
  approvedApplications: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalAmountRequested: number;
  approvedAmount: number;
  friendsCount: number;
  pendingFriendRequests: number;
  achievementsCount: number;
  gameAttempts: number;
  bestGameScore: number;
}

interface Notification {
  id: string;
  type: string;
  user: {
    id: string;
    name?: string | null;
    email: string;
    avatar?: string | null;
  };
  application: {
    id: string;
    title: string;
  };
  createdAt: string;
  timestamp: string;
}

interface ProfileDashboardData {
  user: User;
  friends: Friend[];
  receivedRequests: Friend[];
  achievements: Achievement[];
  stats: Stats;
  notifications: Notification[];
}

interface UseProfileDashboardReturn {
  data: ProfileDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Кэш для данных профиля
const profileCache = new Map<
  string,
  { data: ProfileDashboardData; timestamp: number; etag?: string | null }
>();
const CACHE_DURATION = 30 * 1000; // 30 секунд

export function useProfileDashboard(): UseProfileDashboardReturn {
  const [data, setData] = useState<ProfileDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCacheKey, setUserCacheKey] = useState<string | null>(null);

  // Очищаем кэш при инициализации хука для предотвращения устаревших данных
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);

      // Проверяем кэш (только если уже знаем userId текущего пользователя)
      const cacheKey = userCacheKey;
      const cached = cacheKey ? profileCache.get(cacheKey) : undefined;
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      const response = await fetch("/api/profile/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(cached?.etag ? { "If-None-Match": cached.etag } : {}),
        },
        // Отключаем кэширование браузера для актуальных данных
        cache: "no-store",
      });

      // Не авторизован — это НЕ ошибка для UI профиля, просто показываем экран входа.
      if (response.status === 401) {
        setData(null);
        setUserCacheKey(null);
        setError(null);
        return;
      }

      // 304 — используем кэш
      if (response.status === 304 && cached) {
        profileCache.set(cacheKey as string, {
          ...cached,
          timestamp: now,
        });
        setData(cached.data);
        return;
      }

      if (!response.ok) {
        // Если новый API не работает, fallback на старый подход
        if (response.status === 404 || response.status === 500) {
          console.warn("Dashboard API not available, falling back to individual requests");
          await fetchDataFallback();
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const profileData = await response.json();

      const nextUserId = profileData?.user?.id as string | undefined;
      const nextCacheKey = nextUserId ? `profile-dashboard:${nextUserId}` : null;
      const etag = response.headers.get("etag");
      if (nextCacheKey) setUserCacheKey(nextCacheKey);
      
      // Сохраняем в кэш
      if (nextCacheKey) {
        profileCache.set(nextCacheKey, {
          data: profileData,
          timestamp: now,
          etag,
        });
      }
      
      setData(profileData);
    } catch (err) {
      console.error("Error fetching profile dashboard:", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      
      // Пытаемся использовать fallback при ошибке
      try {
        await fetchDataFallback();
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [userCacheKey]);

  // Fallback функция для совместимости со старым API
  const fetchDataFallback = useCallback(async () => {
    const [userResponse, statsResponse] = await Promise.all([
      fetch("/api/profile/me", { cache: "no-store" }),
      fetch("/api/profile/stats", { cache: "no-store" }).catch(() => null),
    ]);

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();
    const statsData = statsResponse?.ok ? await statsResponse.json() : {};

    const fallbackData = {
      user: userData.user,
      friends: [],
      receivedRequests: [],
      achievements: [],
      stats: statsData || {},
      notifications: [],
    };

    setData(fallbackData);
  }, []);

  const refetch = useCallback(async () => {
    // Очищаем кэш при принудительном обновлении
    profileCache.clear();
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!isInitialized) {
      // Очищаем кэш при первом запуске для предотвращения проблем
      profileCache.clear();
      setIsInitialized(true);
    }
    fetchData();
  }, [fetchData, isInitialized]);

  return { data, loading, error, refetch };
}

// Утилита для инвалидации кэша
export function invalidateProfileCache(): void {
  profileCache.clear();
}
