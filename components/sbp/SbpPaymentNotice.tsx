'use client';

import { LucideIcons } from '@/components/ui/LucideIcons';
import { cn } from '@/lib/utils';
import {
  SBP_APPLICATION_NOTICE,
  SBP_BONUS_NOTICE,
  SBP_UNSUPPORTED_NOTICE,
} from '@/lib/sbp/constants';

type NoticeVariant = 'application' | 'bonus';

const NOTICES: Record<NoticeVariant, string> = {
  application: SBP_APPLICATION_NOTICE,
  bonus: SBP_BONUS_NOTICE,
};

interface SbpPaymentNoticeProps {
  variant: NoticeVariant;
  className?: string;
}

export function SbpPaymentNotice({ variant, className }: SbpPaymentNoticeProps) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-50',
        className,
      )}
      role="note"
    >
      <LucideIcons.Alert
        size="sm"
        className="mt-0.5 shrink-0 text-amber-300"
        aria-hidden
      />
      <div className="space-y-2">
        <p>{NOTICES[variant]}</p>
        <p className="font-medium text-amber-100">{SBP_UNSUPPORTED_NOTICE}</p>
      </div>
    </div>
  );
}
