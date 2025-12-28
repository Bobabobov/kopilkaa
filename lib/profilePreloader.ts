"use client";

// Предзагрузчик данных профиля
class ProfilePreloader {
  private static instance: ProfilePreloader;
  private preloadPromise: Promise<any> | null = null;
  private isPreloading = false;
  private initialized = false;
  private resourcesPreloaded = false;
  private boundListener: ((e: Event) => void) | null = null;

  static getInstance(): ProfilePreloader {
    if (!ProfilePreloader.instance) {
      ProfilePreloader.instance = new ProfilePreloader();
    }
    return ProfilePreloader.instance;
  }

  // Предзагрузка данных профиля
  async preloadProfileData(): Promise<void> {
    if (this.isPreloading || this.preloadPromise) {
      return this.preloadPromise;
    }

    this.isPreloading = true;
    this.preloadPromise = this.fetchProfileData();

    try {
      await this.preloadPromise;
    } catch (error) {
      console.error("Profile preload failed:", error);
    } finally {
      this.isPreloading = false;
    }
  }

  private async fetchProfileData(): Promise<any> {
    try {
      const response = await fetch("/api/profile/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        // Если новый API недоступен, используем fallback
        if (response.status === 404 || response.status === 500) {
          console.warn("Dashboard API not available for preload, using fallback");
          return this.fetchProfileDataFallback();
        }
        throw new Error(`Profile preload failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // При любой ошибке пытаемся использовать fallback
      console.warn("Profile preload failed, trying fallback:", error);
      return this.fetchProfileDataFallback();
    }
  }

  // Fallback предзагрузка через старые API
  private async fetchProfileDataFallback(): Promise<any> {
    try {
      const [userResponse, statsResponse] = await Promise.all([
        fetch("/api/profile/me", { cache: "no-store" }),
        fetch("/api/profile/stats", { cache: "no-store" }).catch(() => null),
      ]);

      const userData = userResponse.ok ? await userResponse.json() : null;
      const statsData = statsResponse?.ok ? await statsResponse.json() : {};

      return {
        user: userData?.user || null,
        friends: [],
        receivedRequests: [],
        achievements: [],
        stats: statsData || {},
        notifications: [],
      };
    } catch (error) {
      console.error("Fallback preload also failed:", error);
      throw error;
    }
  }

  // Предзагрузка при наведении на ссылку профиля
  setupLinkPreloading(): void {
    if (typeof window === "undefined") return;
    if (this.boundListener) return;

    // Делегирование событий: один обработчик на документ вместо навешивания на каждую ссылку.
    this.boundListener = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest?.('a[href="/profile"], a[href^="/profile/"]') as
        | HTMLAnchorElement
        | null;
      if (!link) return;
      this.preloadProfileData();
    };

    document.addEventListener("mouseover", this.boundListener, { passive: true });
    document.addEventListener("focusin", this.boundListener);
  }

  // Предзагрузка критических ресурсов
  preloadCriticalResources(): void {
    if (typeof window === "undefined") return;
    if (this.resourcesPreloaded) return;
    this.resourcesPreloaded = true;

    // Предзагружаем компоненты профиля
    import("@/components/profile/ProfileHeaderCard");
    import("@/components/profile/sections/ProfileFriendsSection");
    import("@/components/profile/sections/ProfileAchievements");
    import("@/components/profile/sections/ProfilePersonalStats");
  }

  // Очистка кэша предзагрузки
  clearPreloadCache(): void {
    this.preloadPromise = null;
    this.isPreloading = false;
  }
}

// Создаем синглтон
export const profilePreloader = ProfilePreloader.getInstance();

// Автоматическая настройка предзагрузки
export function setupProfilePreloading(): void {
  if (typeof window === "undefined") return;
  if (process.env.NODE_ENV !== "production") return;

  // Гарантируем, что инициализация выполняется один раз
  if ((profilePreloader as any).initialized) return;
  (profilePreloader as any).initialized = true;

  // Настраиваем предзагрузку ссылок
  profilePreloader.setupLinkPreloading();
  
  // Предзагружаем критические ресурсы
  profilePreloader.preloadCriticalResources();

  // Предзагрузка при idle состоянии браузера
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => {
      profilePreloader.preloadProfileData();
    });
  } else {
    // Fallback для браузеров без requestIdleCallback
    setTimeout(() => {
      profilePreloader.preloadProfileData();
    }, 2000);
  }
}

// Хук для использования предзагрузки в компонентах
export function useProfilePreload(): {
  preload: () => Promise<void>;
  clearCache: () => void;
} {
  return {
    preload: () => profilePreloader.preloadProfileData(),
    clearCache: () => profilePreloader.clearPreloadCache(),
  };
}
