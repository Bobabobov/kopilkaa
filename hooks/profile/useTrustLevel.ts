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
  effectiveApprovedApplications?: number;
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

export function useTrustLevel({
  approvedApplications,
  effectiveApprovedApplications,
}: UseTrustLevelProps): UseTrustLevelReturn {
  return useMemo(() => {
    const approvedBase = Number.isFinite(effectiveApprovedApplications)
      ? Math.floor(effectiveApprovedApplications as number)
      : Number.isFinite(approvedApplications)
        ? Math.floor(approvedApplications)
        : 0;
    const trustLevel = getTrustLevelFromApprovedCount(approvedBase);
    const trustLimits = getTrustLimits(trustLevel);
    const trustStatus = trustLevel.toLowerCase() as Lowercase<TrustLevel>;
    // В карточке есть свой лейбл “Ориентир по поддержке:”, здесь возвращаем только диапазон.
    const trustSupportText = `от ${trustLimits.min.toLocaleString("ru-RU")} до ${trustLimits.max.toLocaleString(
      "ru-RU",
    )} ₽`;

    const nextRequired = getNextLevelRequirement(trustLevel);
    const progressText =
      nextRequired === null
        ? null
        : (() => {
            const remaining = Math.max(0, nextRequired - approvedBase);
            const ending = remaining === 1 ? "ая" : "ые";
            const noun = remaining === 1 ? "заявка" : "заявки";
            return `До пересмотра уровня: ещё ${remaining} одобренн${ending} ${noun}`;
          })();
    const progressValue =
      nextRequired === null ? null : Math.min(1, Math.max(0, approvedBase / nextRequired));
    const progressCurrent = nextRequired === null ? null : Math.min(approvedBase, nextRequired);
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
  }, [approvedApplications, effectiveApprovedApplications]);
}


