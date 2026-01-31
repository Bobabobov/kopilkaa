"use client";

import ColorWheel from "../ColorWheel";

interface ColorWheelSectionProps {
  selectedColor: string | null;
  selectedColorValue: string | null;
  onColorChange: (color: string) => void;
  onResetColor: () => void;
}

export function ColorWheelSection({
  selectedColor,
  selectedColorValue,
  onColorChange,
  onResetColor,
}: ColorWheelSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-[#fffffe]">
            Цветовой круг Иттена
          </h3>
          <p className="text-sm text-[#abd1c6]">
            Создайте собственный цвет заголовка
          </p>
        </div>
        {selectedColor && (
          <button
            onClick={onResetColor}
            className="text-xs text-[#abd1c6] hover:text-[#fffffe] transition-colors"
          >
            Сбросить цвет
          </button>
        )}
      </div>
      <div className="flex justify-center bg-[#001e1d]/40 rounded-xl p-6 border border-[#abd1c6]/20">
        <ColorWheel
          selectedColor={selectedColorValue || null}
          onColorChange={onColorChange}
        />
      </div>
    </div>
  );
}
