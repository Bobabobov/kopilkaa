// lib/color-utils.ts
// Утилиты для работы с цветами

/**
 * Конвертирует HEX цвет в RGB
 */
export function hexToRgb(
  hex: string,
): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Вычисляет относительную яркость цвета (0-1)
 * Использует формулу W3C для относительной яркости
 */
export function getColorBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.5;

  // Формула W3C для относительной яркости
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  const luminance = 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  return luminance;
}

/**
 * Определяет, является ли цвет светлым (нужен темный текст)
 */
export function isLightColor(hex: string): boolean {
  return getColorBrightness(hex) > 0.5;
}

/**
 * Получает оптимальный цвет текста для фона
 */
export function getTextColorForBackground(hex: string): string {
  return isLightColor(hex) ? "#001e1d" : "#fffffe";
}

/**
 * Получает оптимальный цвет для вторичного текста
 */
export function getSecondaryTextColorForBackground(hex: string): string {
  return isLightColor(hex) ? "#004643" : "#abd1c6";
}

/**
 * Получает оптимальную прозрачность оверлея для читаемости
 */
export function getOverlayOpacity(hex: string): number {
  const brightness = getColorBrightness(hex);

  // Для очень светлых цветов нужен более темный оверлей
  if (brightness > 0.7) return 0.3;
  // Для светлых цветов - средний оверлей
  if (brightness > 0.5) return 0.2;
  // Для темных цветов - минимальный или без оверлея
  if (brightness > 0.3) return 0.1;
  return 0;
}
