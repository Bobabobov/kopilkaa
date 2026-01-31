"use client";

import { useState, useEffect } from "react";
import type { BaseEditorProps } from "./types";

export type SocialType = "vk" | "telegram" | "youtube";

interface SocialLinkEditorProps extends BaseEditorProps {
  label: string;
  placeholder: string;
  value?: string | null;
  type: SocialType;
  onSave: (link: string) => void;
}

export function SocialLinkEditor({
  label,
  placeholder,
  value,
  type,
  disabled,
  onSave,
}: SocialLinkEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const normalizeInput = (link: string) => {
    let normalized = link.trim();
    if (type === "telegram" && normalized.startsWith("@")) {
      const username = normalized.slice(1).trim();
      if (!username) {
        return normalized;
      }
      return `https://t.me/${username}`;
    }

    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    return normalized;
  };

  const validateLink = (link: string) => {
    let parsed: URL;
    try {
      parsed = new URL(link);
    } catch {
      setError(
        type === "vk"
          ? "Введите ссылку вида https://vk.com/username"
          : type === "telegram"
            ? "Введите ссылку вида https://t.me/username"
            : "Введите ссылку вида https://youtube.com/... или https://youtu.be/...",
      );
      return false;
    }

    if (parsed.protocol !== "https:") {
      setError("Ссылка должна начинаться с https://");
      return false;
    }

    const host = parsed.hostname.toLowerCase();
    const allowedHostsMap: Record<SocialType, string[]> = {
      vk: ["vk.com"],
      telegram: ["t.me", "telegram.me"],
      youtube: [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com",
        "youtu.be",
      ],
    };
    const allowedHosts = allowedHostsMap[type];
    const isAllowedHost = allowedHosts.some(
      (allowed) =>
        host === allowed ||
        host.endsWith(`.${allowed}`) ||
        (allowed.startsWith("*.") && host.endsWith(allowed.slice(1))),
    );

    if (!isAllowedHost) {
      setError(
        type === "vk"
          ? "Можно указать только ссылку на vk.com"
          : type === "telegram"
            ? "Можно указать только ссылку на t.me или telegram.me"
            : "Можно указать только ссылку на youtube.com или youtu.be",
      );
      return false;
    }

    if (!parsed.pathname || parsed.pathname === "/") {
      setError(
        type === "youtube"
          ? "Добавьте ссылку на видео, канал или плейлист"
          : "Добавьте имя пользователя в ссылку",
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleSave = () => {
    if (disabled) return;

    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      onSave("");
      setError(null);
      setIsEditing(false);
      return;
    }

    const normalized = normalizeInput(trimmedValue);
    if (validateLink(normalized)) {
      onSave(normalized);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
          {label}
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full sm:flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border rounded-xl bg-[#001e1d]/20 text-[#fffffe] focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent ${
              error ? "border-red-500" : "border-[#abd1c6]/30"
            }`}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={disabled}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
            >
              ✓
            </button>
            <button
              onClick={() => {
                setInputValue(value || "");
                setError(null);
                setIsEditing(false);
              }}
              disabled={disabled}
              className="flex-1 sm:flex-none px-4 py-2.5 sm:py-3 bg-[#6B7280] hover:bg-[#4B5563] text-white font-semibold rounded-xl transition-colors"
            >
              ✗
            </button>
          </div>
        </div>
        <p className="text-xs text-[#abd1c6]/80">
          {type === "vk"
            ? "Только профили vk.com"
            : type === "telegram"
              ? "Только профили t.me / telegram.me или логин вида @username"
              : "Только ссылки на youtube.com или youtu.be"}
        </p>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-sm text-[#fffffe] border border-[#abd1c6]/20 overflow-hidden">
          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f9bc60] hover:underline break-all"
            >
              {value}
            </a>
          ) : (
            <span className="text-[#abd1c6]">Не указано</span>
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
          {value ? "Изменить" : "Добавить"}
        </button>
        {value && (
          <button
            onClick={() => onSave("")}
            disabled={disabled}
            className="w-full sm:w-auto px-4 py-2.5 sm:py-3 bg-transparent border border-[#abd1c6]/40 text-[#abd1c6] rounded-xl hover:border-[#abd1c6] transition-colors"
          >
            Очистить
          </button>
        )}
      </div>
    </div>
  );
}
