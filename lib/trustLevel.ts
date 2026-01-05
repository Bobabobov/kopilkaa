export type TrustLevel = "NEW" | "VERIFIED" | "TRUSTED";

export function getTrustLevelFromApprovedCount(approvedCount: number): TrustLevel {
  const count = Math.max(0, Number.isFinite(approvedCount) ? approvedCount : 0);
  if (count >= 2) return "TRUSTED";
  if (count >= 1) return "VERIFIED";
  return "NEW";
}

export function getTrustLimits(level: TrustLevel): { min: number; max: number } {
  if (level === "TRUSTED") return { min: 50, max: 5000 };
  if (level === "VERIFIED") return { min: 50, max: 1500 };
  return { min: 50, max: 300 };
}

export function getTrustLabel(level: TrustLevel): string {
  switch (level) {
    case "TRUSTED":
      return "Доверенный участник";
    case "VERIFIED":
      return "Проверенный участник";
    default:
      return "Новый участник";
  }
}

