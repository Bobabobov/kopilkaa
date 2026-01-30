"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getTrustLevelFromApprovedCount,
  getTrustLimits,
  type TrustLevel,
} from "@/lib/trustLevel";
import type { UserShape } from "./types";

interface TrustSnapshot {
  trustLevel?: TrustLevel;
  limits?: { min: number; max: number };
  effectiveApprovedApplications?: number;
  approvedApplications?: number;
}

export function useTrustAndReview(user: UserShape | null, amount: string) {
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [hasReview, setHasReview] = useState<boolean | null>(null);
  const [trustSnapshot, setTrustSnapshot] = useState<TrustSnapshot | null>(
    null,
  );

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/profile/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const trust = d?.trust ?? d?.stats?.trust ?? null;
          const approved =
            trust?.approvedApplications ??
            d?.approvedApplications ??
            d?.applications?.approved ??
            d?.applications?.approvedApplications;
          if (typeof approved === "number" && approved >= 0) {
            setApprovedCount(approved);
          }
          setTrustSnapshot(trust);
        })
        .catch(() => {}),
      fetch("/api/reviews", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const review = d?.viewer?.review;
          setHasReview(Boolean(review));
        })
        .catch(() => {}),
    ]);
  }, [user]);

  const isAdmin = user?.role === "ADMIN";
  const effectiveApproved =
    trustSnapshot?.effectiveApprovedApplications ?? approvedCount ?? 0;
  const trustLevel: TrustLevel = useMemo(
    () =>
      trustSnapshot?.trustLevel ??
      getTrustLevelFromApprovedCount(effectiveApproved),
    [effectiveApproved, trustSnapshot],
  );
  const trustLimits = useMemo(
    () => trustSnapshot?.limits ?? getTrustLimits(trustLevel),
    [trustLevel, trustSnapshot],
  );
  const trustHint = isAdmin
    ? "Администратор: лимиты суммы не применяются"
    : `Ориентир для вашего уровня: до ${trustLimits.max.toLocaleString("ru-RU")} ₽. Решение принимается индивидуально.`;
  const amountInt = amount ? parseInt(amount, 10) : NaN;
  const withinTrustRange =
    isAdmin ||
    approvedCount === null ||
    (Number.isFinite(amountInt) &&
      amountInt >= trustLimits.min &&
      amountInt <= trustLimits.max);
  const exceedsTrustLimit =
    !isAdmin &&
    approvedCount !== null &&
    Number.isFinite(amountInt) &&
    amountInt > trustLimits.max;

  return {
    approvedCount,
    hasReview,
    trustSnapshot,
    trustLevel,
    trustLimits,
    trustHint,
    withinTrustRange,
    exceedsTrustLimit,
    effectiveApproved,
    isAdmin,
    amountInt,
  };
}
