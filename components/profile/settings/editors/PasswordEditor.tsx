"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import type { BaseEditorProps } from "./types";

interface PasswordEditorProps extends BaseEditorProps {
  isChanging: boolean;
  passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  passwordError: string;
  onStartChange: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  onFieldChange: (field: keyof PasswordEditorProps["passwordData"], value: string) => void;
}

export function PasswordEditor({
  disabled,
  isChanging,
  passwordData,
  passwordError,
  onStartChange,
  onCancel,
  onSubmit,
  onFieldChange,
}: PasswordEditorProps) {
  if (!isChanging) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
        <div>
          <h4 className="text-sm font-medium text-[#fffffe] mb-1">Пароль</h4>
          <p className="text-xs text-[#abd1c6]">
            Используйте надёжный пароль не короче 6 символов
          </p>
        </div>
        <button
          type="button"
          onClick={onStartChange}
          disabled={disabled}
          className="w-full sm:w-auto px-4 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors"
        >
          Изменить пароль
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-medium text-[#fffffe]">Новый пароль</h4>
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="text-xs text-[#abd1c6] hover:text-[#fffffe] transition-colors"
        >
          Отмена
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wide text-[#abd1c6]">
          Текущий пароль
        </label>
        <input
          type="password"
          value={passwordData.oldPassword}
          onChange={(e) => onFieldChange("oldPassword", e.target.value)}
          disabled={disabled}
          autoComplete="current-password"
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[#abd1c6]/30 rounded-xl bg-[#001e1d]/20 text-[#fffffe] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wide text-[#abd1c6]">
          Новый пароль
        </label>
        <input
          type="password"
          value={passwordData.newPassword}
          onChange={(e) => onFieldChange("newPassword", e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[#abd1c6]/30 rounded-xl bg-[#001e1d]/20 text-[#fffffe] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wide text-[#abd1c6]">
          Подтверждение
        </label>
        <input
          type="password"
          value={passwordData.confirmPassword}
          onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
          disabled={disabled}
          autoComplete="new-password"
          className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-[#abd1c6]/30 rounded-xl bg-[#001e1d]/20 text-[#fffffe] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent"
        />
      </div>

      {passwordError && (
        <p className="text-xs text-red-400">{passwordError}</p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
      >
        {disabled ? (
          <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LucideIcons.Check className="h-4 w-4" />
        )}
        Сохранить пароль
      </button>
    </div>
  );
}
