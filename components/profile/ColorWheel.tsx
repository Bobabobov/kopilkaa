"use client";

import { useState, useRef, useEffect } from "react";

interface ColorWheelProps {
  selectedColor: string | null;
  onColorChange: (color: string) => void;
}

export default function ColorWheel({
  selectedColor,
  onColorChange,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [saturation, setSaturation] = useState(1); // Насыщенность (0 = серый, 1 = чистый цвет)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 20;
    const innerRadius = radius * 0.35; // Внутренний радиус для градиента насыщенности

    // Очищаем canvas
    ctx.clearRect(0, 0, size, size);

    // Рисуем цветовой круг Иттена
    // Используем пиксельный подход для плавного градиента
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        let hue = (angle * 180) / Math.PI + 90;
        if (hue < 0) hue += 360;

        const index = (y * size + x) * 4;

        // Если точка внутри цветового круга
        if (distance >= innerRadius && distance <= radius) {
          const sat = (distance - innerRadius) / (radius - innerRadius);
          const color = hslToRgb(hue, sat * saturation, 0.5);
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = 255;
        }
        // Если точка в центральном круге (яркость)
        else if (distance < innerRadius) {
          const brightness = 1 - distance / innerRadius;
          const gray = Math.round(255 * brightness);
          data[index] = gray;
          data[index + 1] = gray;
          data[index + 2] = gray;
          data[index + 3] = 255;
        }
        // Прозрачный фон
        else {
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Рисуем обводку центрального круга
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [saturation]);

  // Конвертация HSL в RGB
  function hslToRgb(
    h: number,
    s: number,
    l: number,
  ): { r: number; g: number; b: number } {
    h = h % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (h >= 300 && h < 360) {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  // Конвертация RGB в HEX
  function rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")}`;
  }

  // Получаем цвет из точки на canvas
  function getColorFromPoint(x: number, y: number): string {
    const canvas = canvasRef.current;
    if (!canvas) return "#000000";

    const size = canvas.width;
    const center = size / 2;
    const radius = size / 2 - 20;
    const innerRadius = radius * 0.4;

    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    let hue = (angle * 180) / Math.PI + 90; // Поворачиваем на 90 градусов
    if (hue < 0) hue += 360;

    // Если клик в центральном круге - это яркость (черно-белый градиент)
    if (distance < innerRadius) {
      const brightness = 1 - distance / innerRadius;
      const gray = Math.round(255 * brightness);
      return rgbToHex(gray, gray, gray);
    }

    // Если клик в цветовом круге
    if (distance <= radius) {
      const sat = Math.min(
        1,
        (distance - innerRadius) / (radius - innerRadius),
      );
      const rgb = hslToRgb(hue, sat * saturation, 0.5);
      return rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    return "#000000";
  }

  // Обработка клика/перетаскивания
  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    setIsDragging(true);
    handleColorSelect(e);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (isDragging) {
      handleColorSelect(e);
    }
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function handleColorSelect(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const color = getColorFromPoint(x, y);
    onColorChange(color);
  }

  // Парсим выбранный цвет для отображения
  const currentColor = selectedColor?.startsWith("color:")
    ? selectedColor.replace("color:", "")
    : selectedColor || "#000000";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="cursor-crosshair rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Превью выбранного цвета */}
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Выбранный цвет:
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-xl border-2 border-gray-300 dark:border-gray-600 shadow-lg"
            style={{ backgroundColor: currentColor }}
          />
          <div className="flex flex-col gap-1">
            <div className="text-sm font-mono text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded">
              {currentColor.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Кликните на круг для выбора цвета
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
