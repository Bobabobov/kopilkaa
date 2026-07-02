import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AdminSectionLabel } from './admin-ui';

interface AdminPageProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

/** Единый заголовок страницы внутри admin shell. */
export function AdminPage({
  title,
  description,
  children,
  className,
  actions,
}: AdminPageProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl min-w-0', className)}>
      <header className="mb-6 overflow-hidden rounded-2xl border-2 border-[#f9bc60]/25 bg-gradient-to-r from-[#004643]/80 to-[#001e1d]/90">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
          <div className="min-w-0 border-l-4 border-[#f9bc60] pl-4">
            <AdminSectionLabel accent="gold" className="mb-1">
              Админка
            </AdminSectionLabel>
            <h1 className="text-xl font-bold text-[#fffffe] sm:text-2xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1 text-sm text-[#abd1c6]/85">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}
