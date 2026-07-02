import { cn } from '@/lib/utils';

interface AdminActionButtonsProps {
  onApprove?: () => void;
  onReject?: () => void;
  approveLabel?: string;
  rejectLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function AdminActionButtons({
  onApprove,
  onReject,
  approveLabel = 'Подтвердить',
  rejectLabel = 'Отклонить',
  disabled,
  className,
}: AdminActionButtonsProps) {
  return (
    <div className={cn('grid gap-2 sm:grid-cols-2', className)}>
      {onApprove ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onApprove}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-base font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:from-[#059669] hover:to-[#047857] disabled:opacity-50"
        >
          {approveLabel}
        </button>
      ) : null}
      {onReject ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onReject}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e16162] to-[#dc2626] text-base font-bold text-white shadow-lg shadow-rose-900/30 transition hover:from-[#dc2626] hover:to-[#b91c1c] disabled:opacity-50"
        >
          {rejectLabel}
        </button>
      ) : null}
    </div>
  );
}
