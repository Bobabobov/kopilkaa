"use client";

import { useEffect, useId, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordModalProps {
  userId: string;
  userName: string;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (type: "success" | "error", title: string, desc?: string) => void;
}

export function ResetPasswordModal({
  userId,
  userName,
  onClose,
  onSuccess,
  showToast,
}: ResetPasswordModalProps) {
  const titleId = useId();
  const pwdId = `${useId()}-pwd`;
  const confirmId = `${useId()}-confirm`;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [busy, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Заполните оба поля");
      return;
    }
    if (newPassword.length < 6) {
      setError("Пароль не менее 6 символов");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Не удалось сбросить пароль");
        return;
      }

      showToast(
        "success",
        "Пароль сброшен",
        "Передайте новый пароль пользователю. Рекомендуем ему сменить его в настройках.",
      );
      onSuccess();
      onClose();
    } catch {
      setError("Ошибка запроса");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={() => !busy && onClose()}
    >
      <Card
        variant="glass"
        padding="lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[min(90vh,560px)] w-full max-w-md overflow-y-auto border-[#abd1c6]/25 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id={titleId}
              className="text-lg font-semibold text-[#fffffe] sm:text-xl"
            >
              Сбросить пароль
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]/85">
              Пользователь:{" "}
              <span className="font-medium text-[#fffffe]">{userName}</span>
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-[#abd1c6] hover:bg-[#f9bc60]/10 hover:text-[#f9bc60]"
            onClick={onClose}
            disabled={busy}
            aria-label="Закрыть"
          >
            <LucideIcons.X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={pwdId}>Новый пароль</Label>
            <Input
              id={pwdId}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              autoComplete="new-password"
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={confirmId}>Подтвердите пароль</Label>
            <Input
              id={confirmId}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Повторите пароль"
              autoComplete="new-password"
              disabled={busy}
            />
          </div>

          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="w-full border-[#abd1c6]/35 text-[#abd1c6] hover:bg-[#abd1c6]/10 hover:text-[#fffffe] sm:w-auto"
              onClick={onClose}
              disabled={busy}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={busy}
              className="w-full border-0 bg-[#f9bc60] text-[#001e1d] hover:bg-[#f9bc60]/90 sm:w-auto"
            >
              {busy ? (
                <>
                  <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                  Сохранение…
                </>
              ) : (
                "Сбросить пароль"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
