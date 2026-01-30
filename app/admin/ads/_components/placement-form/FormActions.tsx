"use client";
import type { Advertisement } from "../types";

interface FormActionsProps {
  editingAd: Advertisement | null;
  isActive: boolean;
  onActiveChange: (active: boolean) => void;
  onCancel: () => void;
}

export default function FormActions({
  editingAd,
  isActive,
  onActiveChange,
  onCancel,
}: FormActionsProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onActiveChange(e.target.checked)}
            className="w-4 h-4 text-[#f9bc60] bg-[#004643] border-[#abd1c6]/30 rounded focus:ring-[#f9bc60]"
          />
          <span className="text-[#abd1c6]">Активно</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors"
        >
          {editingAd ? "Обновить" : "Создать"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Отмена
        </button>
      </div>
    </>
  );
}
