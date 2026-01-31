/**
 * Общие заголовки и утилиты для API роутов.
 * Устраняет дублирование Cache-Control и других заголовков.
 */
import { NextResponse } from "next/server";

/**
 * Стандартные заголовки для API ответов без кеширования.
 */
export const NO_CACHE_HEADERS = {
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
} as const;

/**
 * Заголовки для кеширования на короткое время (1 минута).
 */
export const SHORT_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
} as const;

/**
 * Заголовки для статических данных (1 час).
 */
export const LONG_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
} as const;

/**
 * Создаёт JSON ответ с заголовками без кеширования.
 */
export function jsonNoCache<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

/**
 * Создаёт JSON ответ об ошибке с заголовками без кеширования.
 */
export function jsonError(
  error: string,
  status = 400
): NextResponse<{ error: string }> {
  return NextResponse.json({ error }, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

/**
 * Создаёт JSON ответ об успехе.
 */
export function jsonSuccess<T extends Record<string, unknown>>(
  data?: T
): NextResponse<{ success: true } & T> {
  return NextResponse.json(
    { success: true, ...data } as { success: true } & T,
    { headers: NO_CACHE_HEADERS }
  );
}

/**
 * Создаёт JSON ответ 401 Unauthorized.
 */
export function jsonUnauthorized(
  message = "Требуется авторизация"
): NextResponse<{ error: string }> {
  return jsonError(message, 401);
}

/**
 * Создаёт JSON ответ 403 Forbidden.
 */
export function jsonForbidden(
  message = "Доступ запрещён"
): NextResponse<{ error: string }> {
  return jsonError(message, 403);
}

/**
 * Создаёт JSON ответ 404 Not Found.
 */
export function jsonNotFound(
  message = "Не найдено"
): NextResponse<{ error: string }> {
  return jsonError(message, 404);
}

/**
 * Создаёт JSON ответ 500 Internal Server Error.
 */
export function jsonServerError(
  message = "Внутренняя ошибка сервера"
): NextResponse<{ error: string }> {
  return jsonError(message, 500);
}
