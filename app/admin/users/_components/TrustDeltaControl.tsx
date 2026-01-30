"use client";

import {
  getTrustLabel,
  getTrustLevelFromEffectiveApproved,
} from "@/lib/trustLevel";
import type { TrustLevel } from "@/lib/trustLevel";

const LEVEL_ORDER: TrustLevel[] = [
  "LEVEL_1",
  "LEVEL_2",
  "LEVEL_3",
  "LEVEL_4",
  "LEVEL_5",
  "LEVEL_6",
];

interface TrustDeltaControlProps {
  userId: string;
  initialDelta: number;
  trustLevel?: TrustLevel;
  effectiveApprovedApplications?: number;
  savingId: string | null;
  setSavingId: (id: string | null) => void;
  onSaved: (next: number) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function TrustDeltaControl({
  userId,
  initialDelta,
  trustLevel,
  effectiveApprovedApplications,
  savingId,
  setSavingId,
  onSaved,
  showToast,
}: TrustDeltaControlProps) {
  const applyDelta = async (levelStep: number) => {
    const currentLevel = trustLevel ?? "LEVEL_1";
    const currentIndex = Math.max(0, LEVEL_ORDER.indexOf(currentLevel));
    const targetIndex = Math.min(
      LEVEL_ORDER.length - 1,
      Math.max(0, currentIndex + levelStep),
    );
    const effectiveApproved = effectiveApprovedApplications ?? 0;
    const targetMinApproved = targetIndex * 3;
    const next = targetMinApproved - effectiveApproved;
    setSavingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/trust-delta`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trustDelta: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ошибка");
      onSaved(data?.trustDelta ?? next);
      showToast(
        "success",
        "Сохранено",
        `trustDelta = ${data?.trustDelta ?? next}`,
      );
    } catch (e: unknown) {
      showToast(
        "error",
        "Не удалось сохранить",
        e instanceof Error ? e.message : undefined,
      );
    } finally {
      setSavingId(null);
    }
  };

  const disabled = savingId === userId;
  return (
    <div className="flex items-center gap-2 text-xs text-[#abd1c6]">
      <span className="text-[#abd1c6]/80">
        Уровень доверия:{" "}
        <span className="text-[#f9bc60] font-semibold">
          {getTrustLabel(trustLevel ?? "LEVEL_1")}
        </span>
      </span>
      <button
        type="button"
        className="px-2 py-1 rounded bg-[#001e1d]/70 border border-[#abd1c6]/30 hover:border-[#f9bc60]/50 transition-colors"
        onClick={() => applyDelta(-1)}
        disabled={disabled}
      >
        -1 уровень
      </button>
      <button
        type="button"
        className="px-2 py-1 rounded bg-[#001e1d]/70 border border-[#abd1c6]/30 hover:border-[#f9bc60]/50 transition-colors"
        onClick={() => applyDelta(1)}
        disabled={disabled}
      >
        +1 уровень
      </button>
    </div>
  );
}
