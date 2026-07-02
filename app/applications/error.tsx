'use client';

import { useEffect } from 'react';
import AppErrorView from '@/components/errors/AppErrorView';
import { LucideIcons } from '@/components/ui/LucideIcons';

export default function ApplicationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Applications page error:', error);
    }
  }, [error]);

  const errorText = error?.message || String(error) || 'Неизвестная ошибка';

  return (
    <AppErrorView
      description="Если вы только что отправили историю — она, скорее всего, сохранена. Перейдите в профиль и проверьте список публикаций."
      onRetry={reset}
      secondaryHref="/profile"
      secondaryLabel="Мой профиль"
      secondaryIcon={<LucideIcons.User size="sm" />}
      detailsContent={<p>{errorText}</p>}
      detailsToggleLabel="Показать подробности (для поддержки)"
    />
  );
}
