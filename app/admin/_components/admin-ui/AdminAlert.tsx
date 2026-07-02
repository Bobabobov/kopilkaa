import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminAlertProps {
  title: string;
  children?: ReactNode;
  tone?: 'warning' | 'danger' | 'success';
  className?: string;
}

export function AdminAlert({
  title,
  children,
  tone = 'warning',
  className,
}: AdminAlertProps) {
  const styles =
    tone === 'danger'
      ? 'border-rose-400/50 bg-rose-500/15 text-rose-100'
      : tone === 'success'
        ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100'
        : 'border-amber-400/50 bg-amber-500/15 text-amber-100';

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-2xl border-2 px-4 py-3 shadow-[0_0_24px_rgba(0,0,0,0.15)]',
        styles,
        className,
      )}
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 opacity-90" />
      <div>
        <p className="font-semibold">{title}</p>
        {children ? (
          <div className="mt-1 text-sm opacity-90">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
