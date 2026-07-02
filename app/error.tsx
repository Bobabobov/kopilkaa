'use client';

import { useEffect } from 'react';
import AppErrorView from '@/components/errors/AppErrorView';
import { LucideIcons } from '@/components/ui/LucideIcons';

/**
 * Граница ошибки для всего приложения: понятный текст, без техподробностей по умолчанию.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error]', error?.digest ?? '', error);
  }, [error]);

  const hint =
    error?.message && error.message.length < 200 ? error.message : '';

  const detailsContent = (
    <div className="space-y-2">
      {error?.digest && (
        <p>
          <span className="text-[#94a1b2]">Код:</span> {error.digest}
        </p>
      )}
      {hint && <p>{hint}</p>}
      {!hint && !error?.digest && (
        <p className="text-[#94a1b2]">Подробности недоступны.</p>
      )}
    </div>
  );

  return (
    <AppErrorView
      description="Страница временно недоступна. Данные в профиле и историях обычно в порядке — попробуйте обновить страницу или зайти с главной."
      onRetry={reset}
      secondaryHref="/"
      secondaryLabel="На главную"
      secondaryIcon={<LucideIcons.Home size="sm" />}
      detailsContent={detailsContent}
    />
  );
}
