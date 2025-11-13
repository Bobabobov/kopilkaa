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
        <div className="flex gap-2">
          <input
            type="email"
            value={value}
            onChange={handleChange}
            className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent bg-[#001e1d]/20 text-[#fffffe] ${
              !isValid ? "border-red-500" : "border-[#abd1c6]/30"
            }`}
            placeholder="Введите ваш email"
            disabled={disabled}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={disabled || !value.trim() || !isValid || value.trim() === currentEmail}
            className="px-4 py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            disabled={disabled}
            className="px-4 py-3 bg-[#6B7280] hover:bg-[#4B5563] text-white font-semibold rounded-xl transition-colors"
          >
            ✗
          </button>
        </div>
        {!isValid && (
          <p className="text-xs text-red-400">Введите корректный email адрес</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-4 py-3 bg-[#001e1d]/20 rounded-xl text-[#fffffe]">
        {currentEmail}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        disabled={disabled}
        className="px-4 py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors"
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
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-4 py-3 border border-[#abd1c6]/30 rounded-xl focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent bg-[#001e1d]/20 text-[#fffffe]"
          placeholder="Введите ваше имя"
          disabled={disabled}
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={disabled || !value.trim() || value.trim() === currentName}
          className="px-4 py-3 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#6B7280] text-white font-semibold rounded-xl transition-colors"
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          disabled={disabled}
          className="px-4 py-3 bg-[#6B7280] hover:bg-[#4B5563] text-white font-semibold rounded-xl transition-colors"
        >
          ✗
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-4 py-3 bg-[#001e1d]/20 rounded-xl text-[#fffffe]">
        {currentName || "Не указано"}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        disabled={disabled}
        className="px-4 py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors"
      >
        Изменить
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
    <div className="flex items-center justify-between p-4 bg-[#001e1d]/20 rounded-xl border border-[#abd1c6]/20">
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
