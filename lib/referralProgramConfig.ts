/** Без серверных зависимостей — можно импортировать из client-бандла (Копи и т.п.). */

export const REFERRAL_PROGRAM_PAUSED_MESSAGE =
  'Реферальная программа временно не работает. Мы вернём её позже.';

/** По умолчанию программа на паузе. Включить: REFERRAL_PROGRAM_ENABLED=true в .env */
export function isReferralProgramEnabled(): boolean {
  return process.env.REFERRAL_PROGRAM_ENABLED === 'true';
}
