"use client";

import { GlassModal, GlassModalHeader } from "@/components/ui/GlassModal";
import type { AdRequest } from "./types";
import { formatLabels } from "./constants";

interface AdRequestModalProps {
  request: AdRequest;
  newStatus: string;
  adminComment: string;
  updating: boolean;
  onStatusChange: (status: string) => void;
  onCommentChange: (comment: string) => void;
  onUpdate: () => void;
  onClose: () => void;
}

export default function AdRequestModal({
  request,
  newStatus,
  adminComment,
  updating,
  onStatusChange,
  onCommentChange,
  onUpdate,
  onClose,
}: AdRequestModalProps) {
  return (
    <GlassModal
      open
      onClose={onClose}
      size="2xl"
      zIndex={50}
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={!updating}
      maxHeight="min(90dvh, 800px)"
      header={
        <GlassModalHeader title="Обработка заявки" onClose={onClose} />
      }
      footer={
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onUpdate}
            disabled={updating}
            className="flex-1 rounded-lg bg-[#f9bc60] px-6 py-3 font-semibold text-[#001e1d] transition-colors hover:bg-[#f9bc60]/90 disabled:opacity-50"
          >
            {updating ? "Сохранение..." : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={updating}
            className="rounded-lg bg-white/10 px-6 py-3 font-semibold text-[#abd1c6] transition-colors hover:bg-white/15 disabled:opacity-50"
          >
            Отмена
          </button>
        </div>
      }
    >
      <div className="mb-6 space-y-4">
        <div>
          <div className="mb-1 text-sm font-medium text-[#abd1c6]">Компания</div>
          <div className="text-[#fffffe]">{request.companyName}</div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium text-[#abd1c6]">Email</div>
          <div className="text-[#fffffe]">{request.email}</div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium text-[#abd1c6]">Формат</div>
          <div className="text-[#fffffe]">
            {formatLabels[request.format] || request.format}
          </div>
        </div>
        <div>
          <div className="mb-1 text-sm font-medium text-[#abd1c6]">Срок</div>
          <div className="text-[#fffffe]">{request.duration} дней</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#abd1c6]">
            Статус
          </label>
          <select
            value={newStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            disabled={updating}
            className="w-full rounded-lg border border-[#abd1c6]/30 bg-[#004643] px-4 py-3 text-[#fffffe] focus:border-[#f9bc60] focus:outline-none disabled:opacity-60"
          >
            <option value="new">Новая</option>
            <option value="processing">В обработке</option>
            <option value="approved">Одобрена</option>
            <option value="rejected">Отклонена</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#abd1c6]">
            Комментарий администратора
          </label>
          <textarea
            value={adminComment}
            onChange={(e) => onCommentChange(e.target.value)}
            rows={4}
            disabled={updating}
            className="w-full rounded-lg border border-[#abd1c6]/30 bg-[#004643] px-4 py-3 text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none disabled:opacity-60"
            placeholder="Оставьте комментарий (необязательно)"
          />
        </div>
      </div>
    </GlassModal>
  );
}
