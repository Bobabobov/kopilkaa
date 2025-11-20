// lib/cache.ts
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Очистка устаревших элементов
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Автоматическая очистка каждые 5 минут
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000);
}

// Утилиты для кэширования API запросов
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  // Проверяем кэш
  const cached = memoryCache.get<T>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Выполняем запрос
    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Если ошибка сервера, возвращаем кэш если есть
      const staleCache = memoryCache.get<T>(cacheKey);
      if (staleCache) {
        return staleCache;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Сохраняем в кэш
    memoryCache.set(cacheKey, data, ttl);
    
    return data;
  } catch (error) {
    // Если ошибка сети - возвращаем кэшированные данные если есть
    const staleCache = memoryCache.get<T>(cacheKey);
    if (staleCache) {
      return staleCache;
    }
    
    // Если нет кэша - возвращаем пустые данные в зависимости от URL
    if (url.includes("/api/stats")) {
      return {
        stats: {
          applications: { total: 0, pending: 0, approved: 0, rejected: 0 },
          users: { total: 0, new: 0 },
        },
      } as T;
    }
    if (url.includes("/api/applications/recent")) {
      return { success: true, applications: [] } as T;
    }
    if (url.includes("/api/ads/active")) {
      return { ad: null } as T;
    }
    
    // Для остальных - пробрасываем ошибку
    throw error;
  }
}

// Кэширование для пользовательских данных
export function cacheUserData<T>(userId: string, data: T, ttl: number = 10 * 60 * 1000): void {
  memoryCache.set(`user:${userId}`, data, ttl);
}

export function getCachedUserData<T>(userId: string): T | null {
  return memoryCache.get<T>(`user:${userId}`);
}

// Кэширование для статистики
export function cacheStats<T>(data: T, ttl: number = 2 * 60 * 1000): void {
  memoryCache.set('stats', data, ttl);
}

export function getCachedStats<T>(): T | null {
  return memoryCache.get<T>('stats');
}
