import type { SameApplicationRef } from '@/app/admin/applications/[id]/types';

/** Заявки с совпадением, но от других пользователей (мультиаккаунт). */
export function filterOtherUserApplicationRefs(
  refs: SameApplicationRef[] | undefined,
  currentUserId: string,
): SameApplicationRef[] {
  return (refs ?? []).filter((row) => row.user.id !== currentUserId);
}

export function countOtherUserApplicationRefs(
  refs: SameApplicationRef[] | undefined,
  currentUserId: string,
): number {
  return filterOtherUserApplicationRefs(refs, currentUserId).length;
}
