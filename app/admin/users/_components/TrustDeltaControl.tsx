"use client";

import type { TrustLevel } from "@/lib/trustLevel";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { throwIfApiFailed } from "@/lib/api/parseApiError";

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
  initialDelta: _initialDelta,
  trustLevel,
  effectiveApprovedApplications,
  savingId,
  setSavingId,
  onSaved,
  showToast,
}: TrustDeltaControlProps) {
  void _initialDelta;

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
      throwIfApiFailed(res, data, "Не удалось сохранить изменение уровня доверия");
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
  const currentLevel = trustLevel ?? "LEVEL_1";
  const currentIndex = Math.max(0, LEVEL_ORDER.indexOf(currentLevel));
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < LEVEL_ORDER.length - 1;

  return (
    <div className="rounded-xl border border-[#abd1c6]/15 bg-[#001e1d]/35 p-3">
      <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-wider text-[#abd1c6]/60">
        Корректировка уровня доверия
      </p>
      <p className="mb-3 text-xs text-[#abd1c6]/75">
        Сдвигает уровень на шаг вниз или вверх относительно текущего расчёта по
        одобренным заявкам (шаг ≈ 3 одобрения).
      </p>
      <div className="flex flex-col gap-2 xs:flex-row xs:flex-wrap xs:items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-[#abd1c6]/30 text-[#fffffe] hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 xs:w-auto"
              onClick={() => applyDelta(-1)}
              disabled={disabled || !canDecrease}
            >
              −1 уровень
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[220px] text-xs">
            Понизить уровень доверия на одну ступень (если это возможно).
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-[#abd1c6]/30 text-[#fffffe] hover:border-[#f9bc60]/45 hover:bg-[#f9bc60]/10 xs:w-auto"
              onClick={() => applyDelta(1)}
              disabled={disabled || !canIncrease}
            >
              +1 уровень
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[220px] text-xs">
            Повысить уровень доверия на одну ступень (если это возможно).
          </TooltipContent>
        </Tooltip>
        {disabled ? (
          <span className="flex items-center gap-1.5 text-xs text-[#abd1c6]/70">
            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#f9bc60]/40 border-t-transparent" />
            Сохранение…
          </span>
        ) : null}
      </div>
    </div>
  );
}
