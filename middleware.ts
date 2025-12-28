import { NextRequest, NextResponse } from "next/server";
import {
  logSecurityEvent,
  detectSuspiciousActivity,
  getRealIP,
} from "./lib/security";

// Rate limiting store (в продакшене лучше использовать Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting функция
function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000) {
  const now = Date.now();
  const key = ip;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Новое окно или первая попытка
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    // Превышен лимит
    return false;
  }

  // Увеличиваем счетчик
  record.count++;
  return true;
}

function pruneRateLimitStore(maxEntries: number = 5000) {
  // Простая защита от бесконечного роста Map (актуально для VPS/long-running)
  if (rateLimitStore.size <= maxEntries) return;
  const now = Date.now();
  for (const [k, v] of rateLimitStore.entries()) {
    if (now > v.resetTime) rateLimitStore.delete(k);
    if (rateLimitStore.size <= maxEntries) return;
  }
  // Если всё ещё много — удаляем “самые первые” по порядку итерации
  const overflow = rateLimitStore.size - maxEntries;
  if (overflow > 0) {
    let i = 0;
    for (const k of rateLimitStore.keys()) {
      rateLimitStore.delete(k);
      i++;
      if (i >= overflow) break;
    }
  }
}

// Основной middleware
export function middleware(req: NextRequest) {
  const realIP = getRealIP(req);
  pruneRateLimitStore();
  const isProd = process.env.NODE_ENV === "production";

  // Проверяем на подозрительную активность
  if (detectSuspiciousActivity(req)) {
    logSecurityEvent(req, "suspicious_request", "Suspicious activity detected");
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Применяем rate limiting к чувствительным API роутам (anti-spam)
  // NOTE: это in-memory лимит (VPS). Для нескольких инстансов нужен Redis.
  const path = req.nextUrl.pathname;
  const modal = req.nextUrl.searchParams.get("modal") || "";
  const isAuthModal = modal === "auth" || modal.startsWith("auth/");
  const isPost = req.method === "POST";
  const isAuthApi = path.startsWith("/api/auth/");
  const isUploadsApi = path === "/api/uploads";
  const isApplicationsApi = path === "/api/applications";
  const isStoryLikeApi = /^\/api\/stories\/[^/]+\/like$/.test(path);
  const isHeroesApi = path === "/api/heroes";

  let limit: number | null = null;
  let windowMs: number | null = null;
  let retryAfterSec: number | null = null;

  if (isAuthApi) {
    // 5 запросов/мин на IP
    limit = 5;
    windowMs = 60_000;
    retryAfterSec = 60;
  } else if (isPost && isUploadsApi) {
    // Загрузка файлов: 20 запросов/5 минут на IP
    limit = 20;
    windowMs = 5 * 60_000;
    retryAfterSec = 5 * 60;
  } else if (isPost && isApplicationsApi) {
    // Создание заявки: 5 запросов/час на IP (дополнительно к 1/24ч на пользователя в API)
    limit = 5;
    windowMs = 60 * 60_000;
    retryAfterSec = 60 * 60;
  } else if ((req.method === "POST" || req.method === "DELETE") && isStoryLikeApi) {
    // Лайки: ограничение на частые клики/ботов
    limit = 60;
    windowMs = 60_000;
    retryAfterSec = 60;
  } else if (req.method === "GET" && isHeroesApi) {
    // Публичный список — лёгкая защита от скрейпинга
    limit = 300;
    windowMs = 60_000;
    retryAfterSec = 60;
  }

  if (limit && windowMs && retryAfterSec) {
    if (!rateLimit(realIP, limit, windowMs)) {
      logSecurityEvent(req, "rate_limit", `Rate limit exceeded for IP: ${realIP}`);
      return new NextResponse(JSON.stringify({ error: "Too many requests. Please try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(retryAfterSec),
        },
      });
    }
  }

  // Создаем ответ с заголовками безопасности
  const response = NextResponse.next();

  const isTowerBlocks = path.startsWith("/tower-blocks");

  // Content Security Policy
  // В DEV Next.js использует eval (webpack/HMR), поэтому строгий CSP ломает сайт.
  // В PROD CSP включаем и держим строгим.
  if (isProd) {
    response.headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        // Telegram widget и Google Identity Services могут использовать eval внутри своих библиотек.
        // Важно: CSP применяется к документу при первой загрузке. Модалка открывается без перезагрузки,
        // поэтому нельзя “включать unsafe-eval только когда ?modal=auth”.
        // Держим unsafe-eval включенным в PROD, но ограничиваем источники скриптов.
        isTowerBlocks
          ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://codepen.io https://cdnjs.cloudflare.com https://telegram.org https://accounts.google.com"
          : "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://telegram.org https://accounts.google.com",
        "style-src 'self' 'unsafe-inline' https://accounts.google.com", // Tailwind/Google OAuth
        "img-src 'self' data: blob: https:",
        "font-src 'self' data:",
        // Разрешаем загрузку видео с внешних источников
        "media-src 'self' blob: data: https:",
        // Разрешаем запросы к Telegram OAuth и Google OAuth (для виджета входа)
        // Google Identity Services иногда делает запросы на play.google.com/log (телеметрия).
        "connect-src 'self' https://oauth.telegram.org https://telegram.org https://accounts.google.com https://play.google.com",
        // Разрешаем встраивать iframe Telegram OAuth и Google OAuth
        "frame-src 'self' https://oauth.telegram.org https://telegram.org https://accounts.google.com",
        "frame-ancestors 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join("; "),
    );
  }

  // Другие заголовки безопасности
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // HSTS (только для HTTPS)
  if (isProd && req.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains",
    );
  }

  return response;
}

// Конфигурация для каких путей применять middleware
export const config = {
  matcher: [
    /*
     * Применяем ко всем путям кроме:
     * - api (внутренние Next.js API)
     * - _next/static (статические файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico (иконка сайта)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    // Включаем middleware для чувствительных API (rate limit + security checks)
    "/api/auth/:path*",
    "/api/uploads",
    "/api/applications",
    "/api/stories/:path*",
    "/api/heroes",
  ],
};
