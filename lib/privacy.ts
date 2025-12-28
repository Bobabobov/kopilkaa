export type EmailPrivacyUser = {
  id: string;
  email?: string | null;
  hideEmail?: boolean | null;
};

/**
 * Убирает email из объекта пользователя для "публичного" просмотра.
 * Правило:
 * - владелец (viewerId === user.id) всегда видит свой email
 * - остальные видят email только если hideEmail === false
 * - по умолчанию hideEmail считается true
 */
export function sanitizeEmailForViewer<T extends EmailPrivacyUser>(
  user: T,
  viewerId: string,
): T {
  const hide = user.hideEmail ?? true;
  if (viewerId !== user.id && hide) {
    return { ...user, email: null };
  }
  return user;
}



