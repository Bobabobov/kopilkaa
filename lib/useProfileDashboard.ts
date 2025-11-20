"use client";
import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  email: string;
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
const profileCache = new Map<string, { data: ProfileDashboardData; timestamp: number }>();
const CACHE_DURATION = 30 * 1000; // 30 секунд

export function useProfileDashboard(): UseProfileDashboardReturn {
  const [data, setData] = useState<ProfileDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Очищаем кэш при инициализации хука для предотвращения устаревших данных
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      
      // Проверяем кэш
      const cacheKey = "profile-dashboard";
      const cached = profileCache.get(cacheKey);
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
        },
        // Отключаем кэширование браузера для актуальных данных
        cache: "no-store",
      });

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
      
      // Сохраняем в кэш
      profileCache.set(cacheKey, {
        data: profileData,
        timestamp: now,
      });
      
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
  }, []);

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

// Хук для кэширования отдельных секций данных
export function useProfileSection<T>(
  sectionKey: keyof ProfileDashboardData,
  defaultValue: T
): T {
  const [sectionData, setSectionData] = useState<T>(defaultValue);

  useEffect(() => {
    const cached = profileCache.get("profile-dashboard");
    if (cached?.data?.[sectionKey]) {
      setSectionData(cached.data[sectionKey] as T);
    }
  }, [sectionKey]);

  return sectionData;
}

// Утилита для инвалидации кэша
export function invalidateProfileCache(): void {
  profileCache.clear();
}

// Утилита для предзагрузки данных
export async function prefetchProfileData(): Promise<void> {
  try {
    const response = await fetch("/api/profile/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      profileCache.set("profile-dashboard", {
        data,
        timestamp: Date.now(),
      });
    }
  } catch (error) {
    console.error("Error prefetching profile data:", error);
  }
}
