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

// Основной middleware
export function middleware(req: NextRequest) {
  const realIP = getRealIP(req);

  // Проверяем на подозрительную активность
  if (detectSuspiciousActivity(req)) {
    logSecurityEvent(req, "suspicious_request", "Suspicious activity detected");
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Применяем rate limiting к API auth роутам
  if (req.nextUrl.pathname.startsWith("/api/auth/")) {
    if (!rateLimit(realIP, 5, 60000)) {
      // 5 запросов в минуту
      logSecurityEvent(
        req,
        "rate_limit",
        `Rate limit exceeded for IP: ${realIP}`,
      );
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        },
      );
    }
  }

  // Создаем ответ с заголовками безопасности
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Разрешаем внешние скрипты для игр, Telegram-виджета и Google OAuth
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://codepen.io https://cdnjs.cloudflare.com https://telegram.org https://accounts.google.com",
      "style-src 'self' 'unsafe-inline'", // TailwindCSS требует unsafe-inline
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      // Разрешаем запросы к Telegram OAuth и Google OAuth (для виджета входа)
      "connect-src 'self' https://oauth.telegram.org https://telegram.org https://accounts.google.com",
      // Разрешаем встраивать iframe Telegram OAuth
      "frame-src 'self' https://oauth.telegram.org https://telegram.org",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  );

  // Другие заголовки безопасности
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // HSTS (только для HTTPS)
  if (req.nextUrl.protocol === "https:") {
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
  ],
};
