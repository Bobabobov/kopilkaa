/**
 * Централизованный экспорт всех user-related утилит.
 * 
 * Использование:
 * import { getUserStatus, resolveUser, getTrustLabel } from "@/lib/user";
 */

// User status (online/offline)
export { getUserStatus, type UserStatusResult } from "../userStatus";

// User resolving (by id, username, email)
export { resolveUser } from "../userResolve";

// Profile URL building
export { getPublicProfilePath } from "../profileUrl";

// Trust level utilities
export {
  getTrustLabel,
  getTrustLimits,
  getTrustLevelFromApprovedCount,
  getNextLevelRequirement,
  type TrustLevel,
} from "../trustLevel";
