export type TrustLevel =
  | "LEVEL_1"
  | "LEVEL_2"
  | "LEVEL_3"
  | "LEVEL_4"
  | "LEVEL_5"
  | "LEVEL_6";

const TRUST_LEVELS_ORDER: TrustLevel[] = [
  "LEVEL_1",
  "LEVEL_2",
  "LEVEL_3",
  "LEVEL_4",
  "LEVEL_5",
  "LEVEL_6",
];

const TRUST_LIMITS: Record<TrustLevel, { min: number; max: number }> = {
  LEVEL_1: { min: 50, max: 150 },
  LEVEL_2: { min: 50, max: 300 },
  LEVEL_3: { min: 100, max: 700 },
  LEVEL_4: { min: 100, max: 1500 },
  LEVEL_5: { min: 300, max: 3000 },
  LEVEL_6: { min: 300, max: 5000 },
};

export function getTrustLevelFromApprovedCount(approvedCount: number): TrustLevel {
  const safeCount = Math.max(0, Number.isFinite(approvedCount) ? Math.floor(approvedCount) : 0);
  const levelIndex = Math.min(Math.floor(safeCount / 3), TRUST_LEVELS_ORDER.length - 1);
  return TRUST_LEVELS_ORDER[levelIndex];
}

export function getTrustLimits(level: TrustLevel): { min: number; max: number } {
  return TRUST_LIMITS[level];
}

export function getNextLevelRequirement(level: TrustLevel): number | null {
  switch (level) {
    case "LEVEL_1":
      return 3;
    case "LEVEL_2":
      return 6;
    case "LEVEL_3":
      return 9;
    case "LEVEL_4":
      return 12;
    case "LEVEL_5":
      return 15;
    case "LEVEL_6":
    default:
      return null;
  }
}

export function getTrustLabel(level: TrustLevel): string {
  switch (level) {
    case "LEVEL_6":
      return "Уровень 6";
    case "LEVEL_5":
      return "Уровень 5";
    case "LEVEL_4":
      return "Уровень 4";
    case "LEVEL_3":
      return "Уровень 3";
    case "LEVEL_2":
      return "Уровень 2";
    case "LEVEL_1":
    default:
      return "Уровень 1";
  }
}

export function clampTrustLevel(level: TrustLevel): TrustLevel {
  // уровни заданы порядком массива TRUST_LEVELS_ORDER, поэтому клиппер тривиален
  return level;
}

export function getEffectiveApprovedForTrust(
  effectiveApproved: number,
  trustDelta: number,
): number {
  const base = Number.isFinite(effectiveApproved) ? Math.floor(effectiveApproved) : 0;
  const delta = Number.isFinite(trustDelta) ? Math.floor(trustDelta) : 0;
  return Math.max(0, base + delta);
}export function getTrustLevelFromEffectiveApproved(
  effectiveApproved: number,
  trustDelta: number,
): TrustLevel {
  const adjusted = getEffectiveApprovedForTrust(effectiveApproved, trustDelta);
  return getTrustLevelFromApprovedCount(adjusted);
}
