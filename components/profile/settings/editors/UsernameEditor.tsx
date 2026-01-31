"use client";

import { useState, useEffect } from "react";
import type { BaseEditorProps } from "./types";

interface UsernameEditorProps extends BaseEditorProps {
  currentUsername?: string | null;
  onSave: (username: string) => void;
}

export function UsernameEditor({
  currentUsername,
  onSave,
  disabled,
}: UsernameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(
    currentUsername ? `@${currentUsername}` : "",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(currentUsername ? `@${currentUsername}` : "");
  }, [currentUsername]);

  const normalize = (raw: string) =>
    raw.trim().replace(/^@+/, "").toLowerCase();

  const validate = (raw: string) => {
    const normalized = normalize(raw);
    const pattern = /^[\p{L}\p{N}._-]{3,20}$/u;
    if (!normalized) return "Придумайте логин";
    if (!pattern.test(normalized))
      return "Логин: 3–20 символов (буквы, цифры, ._-)";
    if (
      !/^[\p{L}\p{N}]/u.test(normalized) ||
      !/[\p{L}\p{N}]$/u.test(normalized)
    ) {
      return "Логин должен начинаться и заканчиваться буквой или цифрой";
    }
    return null;
  };

  const handleSave = () => {
    const nextError = validate(value);
    setError(nextError);
    if (nextError) return;

    const normalized = normalize(value);
    if (normalized === (currentUsername ?? "")) {
      setIsEditing(false);
      return;
    }
    onSave(normalized);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(currentUsername ? `@${currentUsername}` : "");
    setError(null);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(validate(e.target.value));
            }}
            className={`w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent bg-[#001e1d]/20 text-[#fffffe] ${
              error ? "border-red-500" : "border-[#abd1c6]/30"
            }`}
            placeholder="@username"
            disabled={disabled}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={disabled || !!error || !value.trim()}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              disabled={disabled}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-[#6B7280] hover:bg-[#4B5563] text-white font-semibold rounded-xl transition-colors"
            >
              ✗
            </button>
          </div>
        </div>
        <p className="text-xs text-[#abd1c6]/80">
          Это ваш публичный логин. Ссылка на профиль будет выглядеть как{" "}
          <span className="text-[#f9bc60]">/profile/@логин</span>.
        </p>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#fffffe] border border-[#abd1c6]/20">
        {currentUsername ? (
          `@${currentUsername}`
        ) : (
          <span className="text-[#abd1c6]">Не задан</span>
        )}
      </div>
      <button
        onClick={() => {
          setIsEditing(true);
          setError(null);
        }}
        disabled={disabled}
        className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors"
      >
        {currentUsername ? "Изменить" : "Задать"}
      </button>
    </div>
  );
}
