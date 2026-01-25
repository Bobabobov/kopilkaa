import { LucideIcons } from "@/components/ui/LucideIcons";

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {label}
      </label>
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#abd1c6] border border-[#abd1c6]/20">
        {value}
      </div>
    </div>
  );
}

export function CopyField({
  label,
  value,
  copyValue,
  onCopy,
  disabled,
}: {
  label: string;
  value: string;
  copyValue: string;
  onCopy: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#fffffe] uppercase tracking-wide">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#001e1d]/20 rounded-xl text-[#abd1c6] border border-[#abd1c6]/20 overflow-hidden">
          <span className="text-[#fffffe] break-all">{value}</span>
        </div>
        <button
          type="button"
          onClick={() => onCopy(copyValue)}
          disabled={disabled}
          className="w-full sm:w-auto shrink-0 px-3 py-2.5 sm:px-4 sm:py-3 bg-[#f9bc60] hover:bg-[#e8a545] disabled:bg-[#6B7280] text-[#001e1d] font-semibold rounded-xl transition-colors inline-flex items-center justify-center gap-2"
        >
          <LucideIcons.Copy size="sm" />
          <span className="hidden sm:inline">Скопировать</span>
          <span className="sm:hidden">Копировать</span>
        </button>
      </div>
    </div>
  );
}
