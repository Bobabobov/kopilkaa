// lib/security.ts - Утилиты для безопасности
import { NextRequest } from "next/server";

// Интерфейс для логов безопасности
interface SecurityLog {
  timestamp: string;
  ip: string;
  userAgent: string;
  path: string;
  type: "rate_limit" | "suspicious_request" | "auth_failure";
  details: string;
}

// Функция для логирования событий безопасности
export function logSecurityEvent(
  req: NextRequest,
  type: SecurityLog["type"],
  details: string,
) {
  const log: SecurityLog = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.headers.get("x-forwarded-for") || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
    path: req.nextUrl.pathname,
    type,
    details,
  };

  // В продакшене лучше отправлять в внешний сервис логирования
  console.warn(`[SECURITY] ${JSON.stringify(log)}`);
}

// Функция для проверки подозрительных паттернов
export function detectSuspiciousActivity(req: NextRequest): boolean {
  const userAgent = req.headers.get("user-agent") || "";
  const path = req.nextUrl.pathname;

  // Проверяем на подозрительные паттерны
  const suspiciousPatterns = [
    /\.\./, // Path traversal
    /<script/i, // XSS попытки
    /union.*select/i, // SQL injection
    /javascript:/i, // JavaScript injection
  ];

  // Проверяем User-Agent на боты/сканеры
  const suspiciousUserAgents = [
    /sqlmap/i,
    /nikto/i,
    /nmap/i,
    /masscan/i,
    /zap/i,
  ];

  const suspiciousPath = suspiciousPatterns.some(
    (pattern) => pattern.test(path) || pattern.test(req.nextUrl.search),
  );

  const suspiciousUA = suspiciousUserAgents.some((pattern) =>
    pattern.test(userAgent),
  );

  return suspiciousPath || suspiciousUA;
}

// Функция для валидации IP адресов
export function isValidIP(ip: string): boolean {
  // Простая проверка IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  return ipv4Regex.test(ip);
}

// Функция для получения реального IP
export function getRealIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  const cfConnectingIP = req.headers.get("cf-connecting-ip");

  // Приоритет: Cloudflare > Real-IP > Forwarded-For > req.ip
  return (
    cfConnectingIP || realIP || forwarded?.split(",")[0] || req.ip || "unknown"
  );
}



