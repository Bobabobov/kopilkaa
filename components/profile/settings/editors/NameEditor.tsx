"use client";

import { useState, useEffect } from "react";
import type { BaseEditorProps } from "./types";

interface NameEditorProps extends BaseEditorProps {
  currentName: string;
  onSave: (name: string) => void;
}

export function NameEditor({ currentName, onSave, disabled }: NameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentName);

  useEffect(() => {
    setValue(currentName);
  }, [currentName]);

  const handleSave = () => {
    if (value.trim() && value.trim() !== currentName) {
      onSave(value.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(currentName);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent bg-[#001e1d]/20 text-[#fffffe]"
          placeholder="Введите ваше имя"
          disabled={disabled}
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={disabled || !value.trim() || value.trim() === currentName}
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
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#fffffe]">
        {currentName || "Не указано"}
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
