"use client";

import { useEffect, useState } from "react";
import type { UserShape } from "./types";

export type PendingReviewApplication = { id: string; title: string } | null;

/** Одобренные заявки и обязательный отзыв — без уровня доверия. */
export function useApplicationReviewStats(user: UserShape | null, amount: string) {
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [pendingReviewApplication, setPendingReviewApplication] =
    useState<PendingReviewApplication>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/profile/stats", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const approved =
            d?.approvedApplications ??
            d?.applications?.approved ??
            d?.applications?.approvedApplications;
          if (typeof approved === "number" && approved >= 0) {
            setApprovedCount(approved);
          }
        })
        .catch(() => {}),
      fetch("/api/reviews", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          const pending = d?.viewer?.pendingReviewApplication ?? null;
          setPendingReviewApplication(
            pending &&
              typeof pending.id === "string" &&
              typeof pending.title === "string"
              ? { id: pending.id, title: pending.title }
              : null,
          );
        })
        .catch(() => {}),
    ]);
  }, [user]);

  const isAdmin = user?.role === "ADMIN";
  const amountInt = amount ? parseInt(amount, 10) : NaN;

  return {
    approvedCount,
    pendingReviewApplication,
    isAdmin,
    amountInt,
  };
}
