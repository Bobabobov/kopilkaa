/** Задержки появления (shadcn animate-in + tailwindcss-animate). */
export const SHOWCASE_CHIP_STAGGER_MS = 60;

export function getShowcaseChipEnterClass(reducedMotion: boolean): string {
  if (reducedMotion) {
    return "";
  }

  return "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2 duration-500 fill-mode-backwards";
}

export function getShowcaseChipEnterStyle(
  index: number,
  reducedMotion: boolean,
): { animationDelay: string } | undefined {
  if (reducedMotion || index <= 0) {
    return undefined;
  }

  return { animationDelay: `${index * SHOWCASE_CHIP_STAGGER_MS}ms` };
}
