// hooks/profile/useTrustLevel.ts
// Расчет уровня доверия пользователя на основе одобренных заявок
import { useMemo } from "react";
import {
  getTrustLevelFromApprovedCount,
  getTrustLimits,
  getNextLevelRequirement,
  TrustLevel,
} from "@/lib/trustLevel";

interface UseTrustLevelProps {
  approvedApplications: number;
}

interface UseTrustLevelReturn {
  trustLevel: TrustLevel;
  trustLimits: { min: number; max: number };
  trustStatus: Lowercase<TrustLevel>;
  trustSupportText: string;
  progressText: string | null;
  progressValue: number | null;
  progressCurrent: number | null;
  progressTotal: number | null;
}

export function useTrustLevel({ approvedApplications }: UseTrustLevelProps): UseTrustLevelReturn {
  return useMemo(() => {
    const trustLevel = getTrustLevelFromApprovedCount(approvedApplications);
    const trustLimits = getTrustLimits(trustLevel);
    const trustStatus = trustLevel.toLowerCase() as Lowercase<TrustLevel>;
    const trustSupportText = `от ${trustLimits.min.toLocaleString("ru-RU")} до ${trustLimits.max.toLocaleString(
      "ru-RU",
    )} ₽`;

    const nextRequired = getNextLevelRequirement(trustLevel);
    const progressText =
      nextRequired === null
        ? null
        : (() => {
            const remaining = Math.max(0, nextRequired - approvedApplications);
            const ending = remaining === 1 ? "ая" : "ые";
            const noun = remaining === 1 ? "заявка" : "заявки";
            return `До следующего уровня — ${remaining} одобренн${ending} ${noun}`;
          })();
    const progressValue =
      nextRequired === null ? null : Math.min(1, Math.max(0, approvedApplications / nextRequired));
    const progressCurrent = nextRequired === null ? null : Math.min(approvedApplications, nextRequired);
    const progressTotal = nextRequired === null ? null : nextRequired;

    return {
      trustLevel,
      trustLimits,
      trustStatus,
      trustSupportText,
      progressText,
      progressValue,
      progressCurrent,
      progressTotal,
    };
  }, [approvedApplications]);
}


