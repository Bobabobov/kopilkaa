/**
 * Экономика уровня профиля.
 *
 * Бонусы копятся на балансе; пользователь сам решает, когда вложить их в опыт.
 * 1 бонус = 0,5 опыта.
 *
 * В БД опыт хранится в половинках (1 единица = 0,5 опыта для отображения).
 *
 * Кривая уровней: для перехода с L на L+1 нужно USER_LEVEL_BASE_XP * L опыта.
 */
export const BONUS_TO_EXPERIENCE_RATIO = 0.5;

/** Масштаб хранения опыта в БД: stored / SCALE = отображаемый опыт. */
export const EXPERIENCE_STORAGE_SCALE = 2;

export const BONUS_WITHDRAWALS_DISABLED_MESSAGE =
  'Вывод гонорара недоступен для вашего аккаунта. Обратитесь к администратору.';

/** Подпись для UI при вложении бонусов в опыт. */
export const BONUS_LEVEL_LABEL = '1 бонус = 0,5 опыта';

/** Простое объяснение механики обмена (понятно даже ребёнку). */
export const LEVEL_EXCHANGE_LABEL =
  'Обменивайте бонусы на опыт и повышайте уровень профиля.';

/** Польза от уровня — показывать рядом с механикой везде. */
export const LEVEL_BENEFIT_HINT =
  'Чем выше уровень — тем больше гонорар за историю. С 3 уровня доступен вывод накопленных бонусов (комиссия 10%, с 4 уровня — 8%).';

/** Опыт для UI и расчёта уровня из значения в БД. */
export function toDisplayExperience(storedExperience: number): number {
  return storedExperience / EXPERIENCE_STORAGE_SCALE;
}

/** Сохранение опыта в БД из отображаемого значения. */
export function toStoredExperience(displayExperience: number): number {
  return Math.round(displayExperience * EXPERIENCE_STORAGE_SCALE);
}

/** Сколько опыта (для UI) даёт вложение бонусов. */
export function bonusesToDisplayExperience(amountBonuses: number): number {
  if (!Number.isInteger(amountBonuses) || amountBonuses < 1) {
    return 0;
  }
  return amountBonuses * BONUS_TO_EXPERIENCE_RATIO;
}

/** Сколько бонусов нужно вложить для заданного объёма опыта (округление вверх). */
export function displayExperienceToBonusesNeeded(
  displayExperience: number,
): number {
  if (displayExperience <= 0) {
    return 0;
  }
  return Math.ceil(displayExperience / BONUS_TO_EXPERIENCE_RATIO);
}

/** Прирост поля experience в БД при вложении бонусов. */
export function bonusesToStoredExperience(amountBonuses: number): number {
  if (!Number.isInteger(amountBonuses) || amountBonuses < 1) {
    return 0;
  }
  return Math.round(
    amountBonuses * BONUS_TO_EXPERIENCE_RATIO * EXPERIENCE_STORAGE_SCALE,
  );
}
