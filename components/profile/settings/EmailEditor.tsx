"use client";

import { useState, useEffect } from "react";

interface EmailEditorProps {
  currentEmail: string;
  onSave: (email: string) => void;
  disabled: boolean;
}

export default function EmailEditor({ 
  currentEmail, 
  onSave, 
  disabled 
}: EmailEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentEmail);
  const [isValid, setIsValid] = useState(true);

  // Обновляем value при изменении currentEmail
  useEffect(() => {
    setValue(currentEmail);
  }, [currentEmail]);

  // Валидация email
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
    setIsValid(validateEmail(newValue) || newValue === '');
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
              !isValid ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Введите ваш email"
            disabled={disabled}
            autoFocus
          />
          <button
            onClick={handleSave}
            disabled={disabled || !value.trim() || !isValid || value.trim() === currentEmail}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            disabled={disabled}
            className="px-4 py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
          >
            ✗
          </button>
        </div>
        {!isValid && (
          <p className="text-xs text-red-500">Введите корректный email адрес</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
        {currentEmail}
      </div>
      <button
        onClick={() => setIsEditing(true)}
        disabled={disabled}
        className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-colors"
      >
        Изменить
      </button>
    </div>
  );
}













