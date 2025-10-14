"use client";

import { useState, useEffect } from "react";

interface NameEditorProps {
  currentName: string;
  onSave: (name: string) => void;
  disabled: boolean;
}

export default function NameEditor({
  currentName,
  onSave,
  disabled,
}: NameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentName);

  // Обновляем value при изменении currentName
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
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="Введите ваше имя"
          disabled={disabled}
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={disabled || !value.trim()}
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
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white">
        {currentName || "Не указано"}
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





