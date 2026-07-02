/** Палитра игры — hex гарантирует корректный цвет без purge Tailwind. */
export interface ColorConflictPaletteEntry {
  name: string;
  hex: string;
  /** Для подсветки кнопок и свечения карточки */
  glowRgb: string;
}

export const COLOR_CONFLICT_PALETTE: readonly ColorConflictPaletteEntry[] = [
  { name: 'КРАСНЫЙ', hex: '#ef4444', glowRgb: '239, 68, 68' },
  { name: 'СИНИЙ', hex: '#3b82f6', glowRgb: '59, 130, 246' },
  { name: 'ЗЕЛЕНЫЙ', hex: '#22c55e', glowRgb: '34, 197, 94' },
  { name: 'ЖЕЛТЫЙ', hex: '#eab308', glowRgb: '234, 179, 8' },
  { name: 'ФИОЛЕТОВЫЙ', hex: '#a855f7', glowRgb: '168, 85, 247' },
] as const;

export const COLOR_CONFLICT_COLOR_NAMES = COLOR_CONFLICT_PALETTE.map(
  (entry) => entry.name,
);

const paletteByName = new Map(
  COLOR_CONFLICT_PALETTE.map((entry) => [entry.name, entry]),
);

export function getColorEntryByName(
  name: string,
): ColorConflictPaletteEntry | null {
  return paletteByName.get(name) ?? null;
}

export function getColorHexByName(name: string): string {
  return getColorEntryByName(name)?.hex ?? '#fffffe';
}

export interface ColorConflictOptionView {
  name: string;
  hex: string;
  glowRgb: string;
}

export function toColorOptionView(name: string): ColorConflictOptionView {
  const entry = getColorEntryByName(name);
  return {
    name,
    hex: entry?.hex ?? '#abd1c6',
    glowRgb: entry?.glowRgb ?? '171, 209, 198',
  };
}
