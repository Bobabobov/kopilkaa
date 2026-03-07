"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getTrustLevelFromApprovedCount,
  getTrustLimitsSafe,
  type TrustLevel,
} from "@/lib/trustLevel";

const VALID_TRUST_LEVELS: TrustLevel[] = [
  "LEVEL_1",
  "LEVEL_2",
  "LEVEL_3",
  "LEVEL_4",
  "LEVEL_5",
  "LEVEL_6",
];
function isValidTrustLevel(v: unknown): v is TrustLevel {
  return typeof v === "string" && VALID_TRUST_LEVELS.includes(v as TrustLevel);
}
import type { UserShape } from "./types";

interface TrustSnapshot {
  trustLevel?: TrustLevel;
  limits?: { min: number; max: number };
  effectiveApprovedApplications?: number;
  approvedApplications?: number;
}

export type PendingReviewApplication = { id: string; title: string } | null;

export function useTrustAndReview(user: UserShape | null, amount: string) {
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [pendingReviewApplication, setPendingReviewApplication] =
    useState<PendingReviewApplication>(null);
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
          const pending = d?.viewer?.pendingReviewApplication ?? null;
          setPendingReviewApplication(
            pending && typeof pending.id === "string" && typeof pending.title === "string"
              ? { id: pending.id, title: pending.title }
              : null,
          );
        })
        .catch(() => {}),
    ]);
  }, [user]);

  const isAdmin = user?.role === "ADMIN";
  const effectiveApproved =
    trustSnapshot?.effectiveApprovedApplications ?? approvedCount ?? 0;
  const trustLevel: TrustLevel = useMemo(() => {
    const fromApi = trustSnapshot?.trustLevel;
    if (isValidTrustLevel(fromApi)) return fromApi;
    return getTrustLevelFromApprovedCount(effectiveApproved);
  }, [effectiveApproved, trustSnapshot]);

  const trustLimits = useMemo(() => {
    const fromApi = trustSnapshot?.limits;
    if (
      fromApi &&
      typeof fromApi.min === "number" &&
      typeof fromApi.max === "number"
    ) {
      return { min: fromApi.min, max: fromApi.max };
    }
    return getTrustLimitsSafe(trustLevel);
  }, [trustLevel, trustSnapshot]);

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
    pendingReviewApplication,
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
