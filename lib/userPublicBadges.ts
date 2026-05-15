/** Поле Prisma для публичных меток пользователя (включается в user select). */
export const USER_PUBLIC_BADGE_SELECT = {
  markedAsDeceiver: true,
} as const;

export const DECEIVER_BADGE = {
  label: "Обманывал",
  tooltip: "Пытался обмануть платформу и был пойман",
} as const;

export type UserPublicBadgeFields = {
  markedAsDeceiver?: boolean;
};
