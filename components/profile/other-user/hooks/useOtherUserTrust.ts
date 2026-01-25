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

export function useOtherUserTrust({
  isAuthenticated,
  resolvedUserId,
  fallbackUserId,
}: UseOtherUserTrustParams) {
  const [approvedApplications, setApprovedApplications] = useState<
    number | null
  >(null);
  const [trustSnapshot, setTrustSnapshot] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const targetId = resolvedUserId || fallbackUserId;
    if (!targetId) return;

    fetch(`/api/users/${targetId}/detailed-stats`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const trust = data?.detailedStats?.trust ?? null;
        const approved =
          trust?.effectiveApprovedApplications ??
          data?.detailedStats?.effectiveApprovedApplications ??
          data?.detailedStats?.applications?.effectiveApproved ??
          data?.detailedStats?.applications?.approved;
        if (typeof approved === "number" && approved >= 0) {
          setApprovedApplications(approved);
        } else {
          setApprovedApplications(0);
        }
        setTrustSnapshot(trust);
      })
      .catch(() => {
        setApprovedApplications(0);
        setTrustSnapshot(null);
      });
  }, [isAuthenticated, resolvedUserId, fallbackUserId]);

  const trustDerived = useMemo(() => {
    const approved = approvedApplications ?? 0;
    const trustLevel: TrustLevel = trustSnapshot?.trustLevel
      ? trustSnapshot.trustLevel
      : getTrustLevelFromApprovedCount(approved);
    const limits = trustSnapshot?.limits ?? getTrustLimits(trustLevel);
    const trustStatus = trustLevel.toLowerCase() as Lowercase<TrustLevel>;
    // В карточке есть свой лейбл “Ориентир по поддержке:”, здесь возвращаем только диапазон.
    const supportText =
      trustSnapshot?.supportRangeText ??
      `от ${limits.min.toLocaleString("ru-RU")} до ${limits.max.toLocaleString("ru-RU")} ₽`;
    const nextReq = getNextLevelRequirement(trustLevel);
    const progressValue =
      nextReq === null ? null : Math.min(1, Math.max(0, approved / nextReq));
    const progressCurrent =
      nextReq === null ? null : Math.min(approved, nextReq);
    const progressTotal = nextReq === null ? null : nextReq;
    const progressText =
      nextReq === null
        ? null
        : (() => {
            const remaining = Math.max(0, nextReq - approved);
            const ending = remaining === 1 ? "ая" : "ые";
            const noun = remaining === 1 ? "заявка" : "заявки";
            return `До пересмотра уровня — ещё ${remaining} одобренн${ending} ${noun}`;
          })();
    return {
      trustStatus,
      supportText,
      progressText,
      progressValue,
      progressCurrent,
      progressTotal,
    };
  }, [approvedApplications, trustSnapshot]);

  return { approvedApplications, trustDerived };
}
