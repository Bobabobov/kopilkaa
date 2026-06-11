"use client";

import { GlassModal } from "@/components/ui/GlassModal";

type Props = {
  isOpen: boolean;
  value: string;
  onChange: (next: string) => void;
  onApply: () => void;
  onRemove: () => void;
  onClose: () => void;
};

export function LinkModal({
  isOpen,
  value,
  onChange,
  onApply,
  onRemove,
  onClose,
}: Props) {
  return (
    <GlassModal
      open={isOpen}
      onClose={onClose}
      size="md"
      title="Добавить ссылку"
      showCloseButton
      footer={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onApply}
            className="rounded-xl bg-[#f9bc60] px-4 py-2 text-sm font-bold text-[#001e1d] transition-colors hover:bg-[#e8a545]"
          >
            Применить
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/30"
          >
            Удалить
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-[#abd1c6] transition-colors hover:bg-white/15"
          >
            Отмена
          </button>
        </div>
      }
    >
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        className="mb-1 w-full rounded-xl border border-white/10 bg-[#001e1d]/40 px-4 py-3 text-sm text-[#fffffe] placeholder:text-white/40 outline-none focus:border-[#f9bc60]/50"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onApply();
          } else if (e.key === "Escape") {
            onClose();
          }
        }}
      />
    </GlassModal>
  );
}
