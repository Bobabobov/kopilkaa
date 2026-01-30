// app/admin/ads/components/ad-requests/AdRequestModal.tsx
"use client";
import { LucideIcons } from "@/components/ui/LucideIcons";
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#001e1d] rounded-xl border border-[#abd1c6]/30 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#fffffe]">
            Обработка заявки
          </h2>
          <button
            onClick={onClose}
            className="text-[#abd1c6] hover:text-[#fffffe] transition-colors"
          >
            <LucideIcons.X size="md" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <div className="text-sm font-medium text-[#abd1c6] mb-1">
              Компания
            </div>
            <div className="text-[#fffffe]">{request.companyName}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-[#abd1c6] mb-1">Email</div>
            <div className="text-[#fffffe]">{request.email}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-[#abd1c6] mb-1">
              Формат
            </div>
            <div className="text-[#fffffe]">
              {formatLabels[request.format] || request.format}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-[#abd1c6] mb-1">Срок</div>
            <div className="text-[#fffffe]">{request.duration} дней</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Статус
            </label>
            <select
              value={newStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] focus:border-[#f9bc60] focus:outline-none"
            >
              <option value="new">Новая</option>
              <option value="processing">В обработке</option>
              <option value="approved">Одобрена</option>
              <option value="rejected">Отклонена</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#abd1c6] mb-2">
              Комментарий администратора
            </label>
            <textarea
              value={adminComment}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-[#004643] border border-[#abd1c6]/30 rounded-lg text-[#fffffe] placeholder-[#abd1c6]/50 focus:border-[#f9bc60] focus:outline-none"
              placeholder="Оставьте комментарий (необязательно)"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={onUpdate}
              disabled={updating}
              className="flex-1 px-6 py-3 bg-[#f9bc60] text-[#001e1d] font-semibold rounded-lg hover:bg-[#f9bc60]/90 transition-colors disabled:opacity-50"
            >
              {updating ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
