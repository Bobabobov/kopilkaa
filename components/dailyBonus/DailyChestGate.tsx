"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  DailyChestModal,
  type DailyChestClaimResult,
  type DailyChestModalPhase,
} from "@/components/dailyBonus/DailyChestModal";
import { dispatchDailyChestClaimed } from "@/lib/dailyChest/events";
import { DAILY_CHEST_OPENING_DURATION_MS } from "@/lib/dailyBonus/chestAnimation";
import { invalidateProfileCache } from "@/hooks/profile/useProfileDashboard";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

const OPEN_DELAY_MS = 1500;
const CHEST_HANDLED_STORAGE_PREFIX = "daily-chest-handled";

const HIDDEN_PATH_PREFIXES = ["/login", "/banned", "/verify-email"];

function getHandledStorageKey(): string {
  const dayKey = new Date().toISOString().slice(0, 10);
  return `${CHEST_HANDLED_STORAGE_PREFIX}-${dayKey}`;
}

type DailyChestResponse = {
  success: boolean;
  data: {
    canClaim: boolean;
    claimedToday: boolean;
    amount?: number;
  };
};

function isHiddenPath(pathname: string): boolean {
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isChestHandledToday(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(getHandledStorageKey()) === "1";
}

function markChestHandledToday(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getHandledStorageKey(), "1");
}

export default function DailyChestGate() {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<DailyChestModalPhase>("invite");
  const [result, setResult] = useState<DailyChestClaimResult | null>(null);
  const [canClaim, setCanClaim] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openingProgress, setOpeningProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fetchingRef = useRef(false);
  const claimingRef = useRef(false);
  const phaseRef = useRef<DailyChestModalPhase>("invite");
  const openingDoneRef = useRef<(() => void) | null>(null);

  const resetModal = useCallback(() => {
    setOpen(false);
    setPhase("invite");
    setResult(null);
    setError(null);
    setOpeningProgress(0);
    claimingRef.current = false;
    openingDoneRef.current = null;
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "opening") return;

    let frameId = 0;
    let cancelled = false;
    const startedAt = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;

      const progress = Math.min(
        (now - startedAt) / DAILY_CHEST_OPENING_DURATION_MS,
        1,
      );
      setOpeningProgress(progress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      openingDoneRef.current?.();
      openingDoneRef.current = null;
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frameId);
    };
  }, [phase]);

  const fetchStatus = useCallback(async (): Promise<boolean> => {
    if (fetchingRef.current) return false;
    fetchingRef.current = true;
    try {
      const res = await fetch("/api/profile/daily-chest", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) return false;

      const raw = (await res.json()) as DailyChestResponse;
      const claimedToday = Boolean(raw.data?.claimedToday);
      const available = Boolean(raw.data?.canClaim) && !claimedToday;
      setCanClaim(available);
      return available;
    } catch {
      return false;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  const scheduleModal = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (loading || !isAuthenticated || isHiddenPath(pathname)) {
      setCanClaim(false);
      return;
    }

    if (isChestHandledToday()) return;

    const available = await fetchStatus();

    if (!available || claimingRef.current) return;

    timerRef.current = setTimeout(() => {
      void fetchStatus().then((stillAvailable) => {
        if (stillAvailable && !claimingRef.current && !isChestHandledToday()) {
          setPhase("invite");
          setResult(null);
          setOpen(true);
        }
      });
    }, OPEN_DELAY_MS);
  }, [fetchStatus, isAuthenticated, loading, pathname]);

  useEffect(() => {
    void scheduleModal();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scheduleModal]);

  useEffect(() => {
    const onClaimed = () => {
      setCanClaim(false);
      markChestHandledToday();
      if (phaseRef.current !== "result") {
        resetModal();
      }
    };
    window.addEventListener("daily-chest-claimed", onClaimed);
    return () => window.removeEventListener("daily-chest-claimed", onClaimed);
  }, [resetModal]);

  const handleOpenChest = useCallback(async () => {
    if (!canClaim || claimingRef.current || phase === "opening") return;

    claimingRef.current = true;
    setError(null);
    setOpeningProgress(0);
    setPhase("opening");

    const animationPromise = new Promise<void>((resolve) => {
      openingDoneRef.current = resolve;
    });

    try {
      const [res] = await Promise.all([
        fetch("/api/profile/daily-chest", {
          method: "POST",
        }),
        animationPromise,
      ]);
      const raw = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          getMessageFromApiJson(raw, "Не удалось открыть сундук"),
        );
      }

      const payload = raw as DailyChestResponse;
      const amount = payload.data.amount ?? 0;

      markChestHandledToday();
      setResult({ amount });
      setCanClaim(false);
      setOpeningProgress(1);
      setPhase("result");
      invalidateProfileCache();
    } catch (e) {
      setPhase("invite");
      setOpeningProgress(0);
      setError(e instanceof Error ? e.message : "Не удалось открыть сундук");
    } finally {
      claimingRef.current = false;
      openingDoneRef.current = null;
    }
  }, [canClaim, phase]);

  const handleClose = useCallback(() => {
    markChestHandledToday();

    if (phase === "result") {
      dispatchDailyChestClaimed();
    }

    resetModal();
  }, [phase, resetModal]);

  return (
    <DailyChestModal
      open={open}
      phase={phase}
      result={result}
      error={error}
      openingProgress={openingProgress}
      onOpenChest={() => void handleOpenChest()}
      onClose={handleClose}
    />
  );
}
