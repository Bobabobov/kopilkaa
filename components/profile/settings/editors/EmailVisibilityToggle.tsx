"use client";

import type { BaseEditorProps } from "./types";

interface EmailVisibilityToggleProps extends BaseEditorProps {
  hideEmail: boolean;
  onToggle: (hide: boolean) => void;
}

export function EmailVisibilityToggle({
  hideEmail,
  onToggle,
  disabled,
}: EmailVisibilityToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
      <div>
        <h4 className="text-sm font-medium text-[#fffffe] mb-1">
          Видимость email
        </h4>
        <p className="text-xs text-[#abd1c6]">
          {hideEmail
            ? "Email скрыт от других пользователей"
            : "Email виден другим пользователям"}
        </p>
      </div>
      <button
        onClick={() => onToggle(!hideEmail)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          hideEmail ? "bg-[#6B7280]" : "bg-[#10B981]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            hideEmail ? "transform translate-x-1" : "transform translate-x-7"
          }`}
        />
      </button>
    </div>
  );
}
