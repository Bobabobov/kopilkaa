"use client";

import { GlassModal } from "@/components/ui/GlassModal";

interface DeleteModalProps {
  id: string;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({
  id,
  title,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  return (
    <GlassModal
      open={Boolean(id)}
      onClose={onClose}
      size="md"
      zIndex={50}
      hideHeader
      showCloseButton={false}
      bodyClassName="p-0"
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-[#abd1c6] transition-colors hover:bg-white/10 hover:text-[#fffffe] touch-manipulation"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#e16162] to-[#d63384] px-6 py-3 font-medium text-white shadow-lg transition-all hover:shadow-xl touch-manipulation"
          >
            Удалить
          </button>
        </div>
      }
    >
      <div className="px-5 py-6 text-center sm:px-6">
        <div className="mb-3 text-5xl sm:mb-4 sm:text-6xl" aria-hidden>
          🗑️
        </div>
        <h3 className="mb-3 text-xl font-bold text-[#fffffe] sm:mb-4 sm:text-2xl">
          Удалить заявку?
        </h3>
        <p className="mb-2 text-sm text-[#abd1c6] sm:text-base">
          Вы уверены, что хотите удалить заявку
        </p>
        <p className="break-words text-sm font-medium text-[#e16162]">
          &ldquo;{title}&rdquo;?
        </p>
      </div>
    </GlassModal>
  );
}
