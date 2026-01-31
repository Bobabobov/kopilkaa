"use client";

import { useState, useEffect } from "react";
import type { BaseEditorProps } from "./types";

interface EmailEditorProps extends BaseEditorProps {
  currentEmail: string;
  onSave: (email: string) => void;
}

export function EmailEditor({
  currentEmail,
  onSave,
  disabled,
}: EmailEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentEmail);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setValue(currentEmail);
  }, [currentEmail]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    if (
      value.trim() &&
      value.trim() !== currentEmail &&
      validateEmail(value.trim())
    ) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(currentEmail);
    setIsEditing(false);
    setIsValid(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsValid(validateEmail(newValue) || newValue === "");
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={value}
            onChange={handleChange}
            className={`w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent bg-[#001e1d]/20 text-[#fffffe] ${
              !isValid ? "border-red-500" : "border-[#abd1c6]/30"
            }`}
            placeholder="Введите ваш email"
            disabled={disabled}
            autoFocus
          />
          <div className="flex gap-2 sm:gap-2">
            <button
              onClick={handleSave}
              disabled={
                disabled ||
                !value.trim() ||
                !isValid ||
                value.trim() === currentEmail
              }
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
        {!isValid && (
          <p className="text-xs text-red-400">Введите корректный email адрес</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#fffffe]">
        {currentEmail}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        disabled={disabled}
        className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors"
      >
        Изменить
      </button>
    </div>
  );
}
