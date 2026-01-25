"use client";

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#004643] rounded-2xl border border-[#abd1c6]/30 p-5 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[#fffffe] font-bold text-lg mb-3">
          Добавить ссылку
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com"
          className="w-full rounded-xl border border-white/10 bg-[#001e1d]/40 px-4 py-3 text-sm text-[#fffffe] placeholder:text-white/40 outline-none focus:border-[#f9bc60]/50 mb-3"
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onApply}
            className="px-4 py-2 rounded-xl bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] font-bold text-sm transition-colors"
          >
            Применить
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold text-sm transition-colors border border-red-400/30"
          >
            Удалить
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#abd1c6] font-semibold text-sm transition-colors"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}
