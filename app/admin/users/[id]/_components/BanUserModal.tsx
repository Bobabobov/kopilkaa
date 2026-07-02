"use client";

import { useState } from "react";
import {
  GlassModal,
  GlassModalCloseButton,
} from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

interface BanUserModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

const BAN_PRESETS = [
  { label: "7 дней", days: 7 },
  { label: "30 дней", days: 30 },
  { label: "365 дней", days: 365 },
] as const;

export function BanUserModal({
  userId,
  userName,
  onClose,
  onSuccess,
  showToast,
}: BanUserModalProps) {
  const [reason, setReason] = useState("Нарушение правил");
  const [days, setDays] = useState<number>(7);
  const [busy, setBusy] = useState(false);

  const handleBan = async () => {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim(), days }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          getMessageFromApiJson(data, "Не удалось заблокировать пользователя"),
        );
      }
      showToast("success", "Заблокирован", data.message);
      onSuccess();
      onClose();
    } catch (error) {
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось заблокировать",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassModal
      open
      onClose={onClose}
      size="md"
      zIndex={50}
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={!busy}
      header={
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.12] px-4 py-4 sm:px-5">
          <div>
            <h2 className="text-lg font-semibold text-[#fffffe]">
              Блокировка
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]/85">
              Пользователь:{" "}
              <span className="font-medium text-[#fffffe]">{userName}</span>
            </p>
          </div>
          <GlassModalCloseButton
            onClose={onClose}
            className={busy ? "pointer-events-none opacity-50" : undefined}
          />
        </div>
      }
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full border-[#abd1c6]/35 text-[#abd1c6] sm:w-auto"
            onClick={onClose}
            disabled={busy}
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={busy || !reason.trim()}
            className="w-full bg-[#e16162] hover:bg-[#dc2626] text-white sm:w-auto"
            onClick={handleBan}
          >
            {busy ? "Блокировка…" : "Заблокировать"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="ban-reason" className="text-[#abd1c6]">
            Причина
          </Label>
          <Input
            id="ban-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={busy}
            className="mt-1.5 border-[#abd1c6]/20 bg-[#001e1d]/90"
          />
        </div>

        <div>
          <p className="mb-2 text-sm text-[#abd1c6]">Срок</p>
          <div className="flex flex-wrap gap-2">
            {BAN_PRESETS.map((preset) => (
              <Button
                key={preset.days}
                type="button"
                size="sm"
                variant={days === preset.days ? "default" : "outline"}
                disabled={busy}
                className={
                  days === preset.days
                    ? "bg-[#e16162] hover:bg-[#dc2626] text-white"
                    : "border-[#abd1c6]/30 text-[#abd1c6]"
                }
                onClick={() => setDays(preset.days)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </GlassModal>
  );
}
