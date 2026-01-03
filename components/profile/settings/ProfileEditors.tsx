"use client";

import { useState, useEffect } from "react";

// Базовый интерфейс для всех редакторов
interface BaseEditorProps {
  disabled: boolean;
}

// Email Editor Component
interface EmailEditorProps extends BaseEditorProps {
  currentEmail: string;
  onSave: (email: string) => void;
}

export function EmailEditor({ currentEmail, onSave, disabled }: EmailEditorProps) {
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
    if (value.trim() && value.trim() !== currentEmail && validateEmail(value.trim())) {
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
              disabled={disabled || !value.trim() || !isValid || value.trim() === currentEmail}
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

// Name Editor Component
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

// Username Editor Component
interface UsernameEditorProps extends BaseEditorProps {
  currentUsername?: string | null;
  onSave: (username: string) => void;
}

export function UsernameEditor({ currentUsername, onSave, disabled }: UsernameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentUsername ? `@${currentUsername}` : "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(currentUsername ? `@${currentUsername}` : "");
  }, [currentUsername]);

  const normalize = (raw: string) => raw.trim().replace(/^@+/, "").toLowerCase();

  const validate = (raw: string) => {
    const normalized = normalize(raw);
    const pattern = /^[\p{L}\p{N}._-]{3,20}$/u;
    if (!normalized) return "Придумайте логин";
    if (!pattern.test(normalized)) return "Логин: 3–20 символов (буквы, цифры, ._-)";
    if (!/^[\p{L}\p{N}]/u.test(normalized) || !/[\p{L}\p{N}]$/u.test(normalized)) {
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
        {currentUsername ? `@${currentUsername}` : <span className="text-[#abd1c6]">Не задан</span>}
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

// Email Visibility Toggle Component
interface EmailVisibilityToggleProps extends BaseEditorProps {
  hideEmail: boolean;
  onToggle: (hide: boolean) => void;
}

export function EmailVisibilityToggle({ hideEmail, onToggle, disabled }: EmailVisibilityToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
      <div>
        <h4 className="text-sm font-medium text-[#fffffe] mb-1">Видимость email</h4>
        <p className="text-xs text-[#abd1c6]">
          {hideEmail ? "Email скрыт от других пользователей" : "Email виден другим пользователям"}
        </p>
      </div>
      <button
        onClick={() => onToggle(!hideEmail)}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          hideEmail ? 'bg-[#6B7280]' : 'bg-[#10B981]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            hideEmail ? 'transform translate-x-1' : 'transform translate-x-7'
          }`}
        />
      </button>
    </div>
  );
}

type SocialType = "vk" | "telegram" | "youtube";

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
      youtube: ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"],
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
