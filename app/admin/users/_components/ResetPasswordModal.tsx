"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

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
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-[#001e1d] to-[#003d3a] rounded-xl p-6 max-w-md w-full border border-[#abd1c6]/20 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#fffffe] mb-1">
          Сбросить пароль
        </h3>
        <p className="text-sm text-[#abd1c6]/80 mb-4">
          Пользователь: <span className="text-[#fffffe]">{userName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-[#abd1c6]/80 mb-1">
              Новый пароль
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#004643] border border-[#abd1c6]/30 text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60]"
              placeholder="Минимум 6 символов"
              autoComplete="new-password"
              disabled={busy}
            />
          </div>
          <div>
            <label className="block text-xs text-[#abd1c6]/80 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#004643] border border-[#abd1c6]/30 text-[#fffffe] placeholder:text-[#abd1c6]/50 focus:outline-none focus:border-[#f9bc60]"
              placeholder="Повторите пароль"
              autoComplete="new-password"
              disabled={busy}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex-1 px-4 py-2 rounded-lg border border-[#abd1c6]/40 text-[#abd1c6] hover:bg-[#abd1c6]/10 transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 px-4 py-2 rounded-lg bg-[#f9bc60] text-[#001e1d] font-medium hover:bg-[#f9bc60]/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <LucideIcons.Loader2 className="w-4 h-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сбросить пароль"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
