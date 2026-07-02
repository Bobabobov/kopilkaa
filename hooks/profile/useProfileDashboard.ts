"use client";
import { useState, useEffect, useCallback } from "react";
import {
  getMessageFromApiJson,
  logRouteCatchError,
} from "@/lib/api/parseApiError";
import type { UserLevelProgress } from "@/lib/userLevel";
import { getUserLevelProgress } from "@/lib/userLevel";
import { toDisplayExperience } from "@/lib/userLevel/economy";
import type { FirstWithdrawalBonusStatus } from "@/lib/bonusWithdrawals/firstWithdrawalBonus";
import { emptyFirstWithdrawalBonusStatus } from "@/lib/bonusWithdrawals/firstWithdrawalBonus";

interface User {
  id: string;
  email: string | null;
  username?: string | null;
  role: "USER" | "ADMIN";
  name?: string | null;
  avatar?: string | null;
  headerTheme?: string | null;
  headerCover?: string | null;
  avatarFrame?: string | null;
  hideEmail?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  createdAt: string;
  lastSeen?: string | null;
  level?: number;
  experience?: number;
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

interface Stats {
  totalApplications: number;
  approvedApplications: number;
  effectiveApprovedApplications?: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalAmountRequested: number;
  approvedAmount: number;
  friendsCount: number;
  pendingFriendRequests: number;
  applications?: {
    effectiveApproved?: number;
  };
}

interface Notification {
  id: string;
  type: string;
  user: {
    id: string;
    username?: string | null;
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

export interface LevelStats {
  approvedTotal: number;
  rejectedTotal: number;
  pending: number;
  approvedCounting?: number;
  approvedWithoutLevel?: number;
  approvedWithLevelDecrease?: number;
  rejectedWithLevelDecrease?: number;
}

export interface ProfileBonusWallet {
  totalEarnedBonuses: number;
  grossBonuses?: number;
  bonusesInvestedInExperience: number;
  bonusesInLevel: number;
  availableBonuses: number;
  pendingWithdrawalBonuses: number;
  withdrawnBonuses: number;
  hasPendingWithdrawal: boolean;
  withdrawalBlocked: boolean;
  withdrawalsDisabled?: boolean;
  firstWithdrawalBonus?: FirstWithdrawalBonusStatus;
  firstWithdrawalBonusEligible?: boolean;
}

interface ProfileDashboardData {
  user: User;
  friends: Friend[];
  receivedRequests: Friend[];
  stats: Stats;
  bonusWallet: ProfileBonusWallet;
  userLevel: UserLevelProgress;
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
const CACHE_DURATION = 5 * 1000; // 5 секунд — уровень и бонусы должны обновляться быстро

export function useProfileDashboard(): UseProfileDashboardReturn {
  const [data, setData] = useState<ProfileDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userCacheKey, setUserCacheKey] = useState<string | null>(null);

  // Очищаем кэш при инициализации хука для предотвращения устаревших данных
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchData = useCallback(async (options?: { silent?: boolean }) => {
    const silent = options?.silent ?? false;

    try {
      setError(null);

      // Проверяем кэш (только если уже знаем userId текущего пользователя)
      const cacheKey = userCacheKey;
      const cached = cacheKey ? profileCache.get(cacheKey) : undefined;
      const now = Date.now();

      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      if (!silent) {
        setLoading(true);
      }

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
          logRouteCatchError(
            "[useProfileDashboard] dashboard API fallback",
            new Error(`HTTP ${response.status}`),
          );
          await fetchDataFallback();
          return;
        }
        const errBody = await response.json().catch(() => null);
        throw new Error(
          getMessageFromApiJson(
            errBody,
            `Не удалось загрузить профиль (${response.status})`,
          ),
        );
      }

      const profileData = await response.json();

      const nextUserId = profileData?.user?.id as string | undefined;
      const nextCacheKey = nextUserId
        ? `profile-dashboard:${nextUserId}`
        : null;
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
      logRouteCatchError("[useProfileDashboard] fetchData", err);
      setError(err instanceof Error ? err.message : "Неизвестная ошибка");

      // Пытаемся использовать fallback при ошибке
      try {
        await fetchDataFallback();
      } catch (fallbackError) {
        logRouteCatchError(
          "[useProfileDashboard] fetchDataFallback",
          fallbackError,
        );
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

    const userJson = await userResponse.json().catch(() => null);
    if (!userResponse.ok) {
      throw new Error(
        getMessageFromApiJson(userJson, "Не удалось загрузить данные профиля"),
      );
    }

    const userData = userJson as { user?: User };
    if (!userData.user) {
      throw new Error("В ответе профиля нет данных пользователя");
    }
    const statsData = statsResponse?.ok ? await statsResponse.json() : {};

    const normalizedStats = (() => {
      const applications = statsData?.applications || {};
      const totalApplications =
        statsData?.totalApplications ??
        applications.total ??
        applications.totalApplications ??
        0;
      const approvedApplications =
        statsData?.approvedApplications ??
        applications.approved ??
        applications.approvedApplications ??
        0;
      const effectiveApprovedApplications =
        statsData?.effectiveApprovedApplications ??
        applications.effectiveApproved ??
        statsData?.approvedApplications ??
        0;
      const pendingApplications =
        statsData?.pendingApplications ??
        applications.pending ??
        applications.pendingApplications ??
        0;
      const rejectedApplications =
        statsData?.rejectedApplications ??
        applications.rejected ??
        applications.rejectedApplications ??
        0;
      const approvedAmount = statsData?.approvedAmount ?? 0;

      return {
        ...statsData,
        applications,
        totalApplications,
        approvedApplications,
        effectiveApprovedApplications,
        pendingApplications,
        rejectedApplications,
        approvedAmount,
      };
    })();

    const fallbackData: ProfileDashboardData = {
      user: userData.user,
      friends: [],
      receivedRequests: [],
      stats: normalizedStats || {},
      bonusWallet: statsData?.bonusWallet ?? {
        totalEarnedBonuses: 0,
        grossBonuses: 0,
        bonusesInvestedInExperience: 0,
        bonusesInLevel: 0,
        availableBonuses: 0,
        pendingWithdrawalBonuses: 0,
        withdrawnBonuses: 0,
        hasPendingWithdrawal: false,
        withdrawalBlocked: false,
        withdrawalsDisabled: false,
        firstWithdrawalBonus: emptyFirstWithdrawalBonusStatus(),
        firstWithdrawalBonusEligible: false,
      },
      userLevel: getUserLevelProgress(
        toDisplayExperience(userData.user.experience ?? 0),
      ),
      notifications: [],
    };

    setData(fallbackData);
  }, []);

  const refetch = useCallback(async () => {
    // Очищаем кэш при принудительном обновлении.
    // silent: не снимаем UI профиля — иначе теряется локальное состояние (модалки и т.п.).
    profileCache.clear();
    await fetchData({ silent: true });
  }, [fetchData]);

  useEffect(() => {
    if (!isInitialized) {
      profileCache.clear();
      setIsInitialized(true);
    }
    fetchData();
  }, [fetchData, isInitialized]);

  useEffect(() => {
    const onFocus = () => {
      profileCache.clear();
      void fetchData({ silent: true });
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchData]);

  return { data, loading, error, refetch };
}

// Утилита для инвалидации кэша
export function invalidateProfileCache(): void {
  profileCache.clear();
}
