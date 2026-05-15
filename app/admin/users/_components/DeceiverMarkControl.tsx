"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import { throwIfApiFailed } from "@/lib/api/parseApiError";

interface DeceiverMarkControlProps {
  userId: string;
  initialMarked: boolean;
  isAdmin: boolean;
  savingId: string | null;
  setSavingId: (id: string | null) => void;
  onSaved: (marked: boolean) => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function DeceiverMarkControl({
  userId,
  initialMarked,
  isAdmin,
  savingId,
  setSavingId,
  onSaved,
  showToast,
}: DeceiverMarkControlProps) {
  const [marked, setMarked] = useState(initialMarked);
  const saving = savingId === userId;

  const toggle = async () => {
    if (isAdmin) {
      showToast("error", "Нельзя пометить администратора");
      return;
    }

    const next = !marked;
    setSavingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/deceiver-mark`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marked: next }),
      });
      await throwIfApiFailed(res, "Не удалось обновить метку");
      setMarked(next);
      onSaved(next);
      showToast(
        "success",
        next ? "Метка установлена" : "Метка снята",
        next
          ? "Бейдж «Обманывал» виден всем на сайте"
          : "Публичный бейдж больше не отображается",
      );
    } catch (error) {
      console.error("Deceiver mark toggle error:", error);
      showToast("error", "Ошибка", "Не удалось обновить метку пользователя");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.65rem] font-medium uppercase tracking-wider text-red-300/90">
          Публичная метка
        </p>
        {marked ? <UserPublicBadges markedAsDeceiver /> : null}
      </div>
      <p className="mb-3 text-xs leading-snug text-[#abd1c6]/75">
        Красный бейдж «Обманывал» с подсказкой при наведении — виден всем
        пользователям на сайте.
      </p>
      <Button
        type="button"
        variant={marked ? "outline" : "destructive"}
        size="sm"
        disabled={saving || isAdmin}
        className={
          marked
            ? "w-full border-red-500/40 text-red-300 hover:bg-red-500/10 sm:w-auto"
            : "w-full sm:w-auto"
        }
        onClick={toggle}
      >
        {saving ? (
          <>
            <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
            Сохранение…
          </>
        ) : marked ? (
          <>
            <LucideIcons.XCircle className="h-4 w-4" />
            Снять метку
          </>
        ) : (
          <>
            <LucideIcons.AlertTriangle className="h-4 w-4" />
            Пометить «Обманывал»
          </>
        )}
      </Button>
    </div>
  );
}
