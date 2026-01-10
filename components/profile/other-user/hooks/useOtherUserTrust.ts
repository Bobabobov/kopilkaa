import { useEffect, useState, useMemo } from "react";
import {
  getNextLevelRequirement,
  getTrustLevelFromApprovedCount,
  getTrustLimits,
  type TrustLevel,
} from "@/lib/trustLevel";

interface UseOtherUserTrustParams {
  isAuthenticated: boolean | null;
  resolvedUserId: string | null;
  fallbackUserId: string;
}

export function useOtherUserTrust({ isAuthenticated, resolvedUserId, fallbackUserId }: UseOtherUserTrustParams) {
  const [approvedApplications, setApprovedApplications] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const targetId = resolvedUserId || fallbackUserId;
    if (!targetId) return;

    fetch(`/api/users/${targetId}/detailed-stats`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const approved = data?.detailedStats?.applications?.approved;
        if (typeof approved === "number" && approved >= 0) {
          setApprovedApplications(approved);
        } else {
          setApprovedApplications(0);
        }
      })
      .catch(() => {
        setApprovedApplications(0);
      });
  }, [isAuthenticated, resolvedUserId, fallbackUserId]);

  const trustDerived = useMemo(() => {
    const approved = approvedApplications ?? 0;
    const trustLevel: TrustLevel = getTrustLevelFromApprovedCount(approved);
    const limits = getTrustLimits(trustLevel);
    const trustStatus = trustLevel.toLowerCase() as Lowercase<TrustLevel>;
    const supportText = `от ${limits.min.toLocaleString("ru-RU")} до ${limits.max.toLocaleString("ru-RU")} ₽`;
    const nextReq = getNextLevelRequirement(trustLevel);
    const progressValue = nextReq === null ? null : Math.min(1, Math.max(0, approved / nextReq));
    const progressCurrent = nextReq === null ? null : Math.min(approved, nextReq);
    const progressTotal = nextReq === null ? null : nextReq;
    const progressText =
      nextReq === null
        ? null
        : (() => {
            const remaining = Math.max(0, nextReq - approved);
            const ending = remaining === 1 ? "ая" : "ые";
            const noun = remaining === 1 ? "заявка" : "заявки";
            return `До следующего уровня — ${remaining} одобренн${ending} ${noun}`;
          })();
    return { trustStatus, supportText, progressText, progressValue, progressCurrent, progressTotal };
  }, [approvedApplications]);

  return { approvedApplications, trustDerived };
}
