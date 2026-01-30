/**
 * Конфиг главной страницы: герой, «Как это работает», общие константы.
 * Тексты и лимиты для секций главной — в одном месте.
 */

export type { HeroStats, HeroSectionProps } from "./hero-section/types";
export {
  HOW_IT_WORKS_STEPS,
  type HowItWorksStep,
} from "./how-it-works/config";

/** Якорь секции «Как это работает» (для ссылок #how-it-works) */
export const HOME_SECTION_IDS = {
  howItWorks: "how-it-works",
} as const;
export const HOME_SECTION_HOW_IT_WORKS_HREF = `#${HOME_SECTION_IDS.howItWorks}`;
