/**
 * Централизованный экспорт всех auth-related утилит.
 * 
 * Использование:
 * import { getSession, verifySession, verifyTelegramAuth } from "@/lib/auth";
 * 
 * Или для конкретного модуля:
 * import { getSession } from "@/lib/auth/session";
 */

// Session management
export {
  getSession,
  signSession,
  verifySession,
  decodeSession,
} from "../auth";

// Telegram authentication
export {
  verifyTelegramAuth,
  type TelegramAuthData,
} from "../telegramAuth";

// Auth modal URL builder
export { buildAuthModalUrl } from "../authModalUrl";

// Ban checking
export {
  checkUserBan,
  checkEmailBan,
  checkIpBan,
  type BanCheckResult,
} from "../ban-check";
