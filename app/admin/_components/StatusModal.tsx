"use client";

import { GlassModal, GlassModalCloseButton } from "@/components/ui/GlassModal";
import { StatusModal as StatusModalType, ApplicationStatus } from "../types";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { AdminQuickReplies } from "./AdminQuickReplies";

interface StatusModalProps {
  modal: StatusModalType;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onCommentChange: (comment: string) => void;
  onDecreaseTrustChange: (next: boolean) => void;
  onSave: () => Promise<void>;
}

export default function StatusModal({
  modal,
  onClose,
  onStatusChange,
  onCommentChange,
  onDecreaseTrustChange,
  onSave,
}: StatusModalProps) {
  const canDecrease =
    modal.status === "APPROVED" || modal.status === "REJECTED";

  return (
    <GlassModal
      open={Boolean(modal.id)}
      onClose={onClose}
      size="3xl"
      zIndex={80}
      panelClassName="max-w-[760px]"
      maxHeight="min(92dvh, 900px)"
      hideHeader
      showCloseButton={false}
      bodyClassName="p-0"
      ariaLabelledBy="admin-status-modal-title"
      header={
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 p-4 sm:p-6 lg:p-7">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <LucideIcons.CheckCircle2 size="sm" className="text-[#f9bc60]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-[#9bb3ab]">
                Изменение заявки
              </p>
              <h2
                id="admin-status-modal-title"
                className="mt-1 text-lg font-bold leading-tight text-[#fffffe] sm:text-xl"
              >
                Статус и комментарий
              </h2>
              <p className="mt-1 text-sm text-[#abd1c6]">
                Здесь можно вернуть заявку в «В обработке» или указать причину
                решения.
              </p>
            </div>
          </div>

          <GlassModalCloseButton onClose={onClose} />
        </div>
      }
      footer={
        <div className="flex flex-col items-stretch justify-end gap-2 pt-0 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-[#abd1c6] transition-colors hover:border-white/20 hover:bg-white/10"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="button"
            className="rounded-2xl bg-[#f9bc60] px-5 py-2.5 font-bold text-[#0f2d2a] shadow-lg transition-colors hover:bg-[#e8a545] hover:shadow-[#f9bc60]/20"
            onClick={onSave}
          >
            Сохранить изменения
          </button>
        </div>
      }
    >
      <div className="space-y-6 p-4 sm:p-6 lg:p-7">
        <div>
          <label className="mb-2 block text-xs font-bold text-[#abd1c6] sm:mb-3 sm:text-sm">
            Новый статус
          </label>
          <select
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#fffffe] outline-none transition-all duration-200 focus:border-[#f9bc60]/30 focus:ring-2 focus:ring-[#f9bc60]/45"
            value={modal.status}
            onChange={(e) =>
              onStatusChange(e.target.value as ApplicationStatus)
            }
          >
            <option value="PENDING">⏳ В обработке</option>
            <option value="APPROVED">✅ Одобрено</option>
            <option value="REJECTED">❌ Отказано</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold text-[#abd1c6] sm:mb-3 sm:text-sm">
            Комментарий администратора
          </label>
          <textarea
            className="min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-[#fffffe] placeholder:text-[#abd1c6]/60 outline-none transition-all duration-200 focus:border-[#f9bc60]/30 focus:ring-2 focus:ring-[#f9bc60]/45"
            value={modal.comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Причина решения / уточнения для автора..."
          />
          <AdminQuickReplies
            mode="insert"
            linkedAccounts={modal.linkedAccounts ?? []}
            onInsert={onCommentChange}
            className="mt-3"
          />
          <p className="mt-2 text-xs text-[#abd1c6]">
            Этот комментарий увидит пользователь в уведомлении и в модальном
            окне.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => onDecreaseTrustChange(!modal.decreaseTrustOnDecision)}
            disabled={!canDecrease}
            className={[
              "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors",
              canDecrease
                ? "border-white/10 bg-white/5 hover:bg-white/10"
                : "cursor-not-allowed border-white/5 bg-white/[0.03] opacity-60",
            ].join(" ")}
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e16162]/25 bg-[#e16162]/12">
                <LucideIcons.AlertTriangle
                  size="sm"
                  className="text-[#e16162]"
                />
              </span>
              <div className="min-w-0 text-left">
                <p className="text-sm font-semibold text-[#fffffe]">
                  Понизить уровень на 1
                </p>
                <p className="text-xs text-[#abd1c6]">
                  Применится при одобрении/отказе
                </p>
              </div>
            </div>
            <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-white/10 bg-white/10">
              <span
                className={[
                  "absolute h-4 w-4 rounded-full transition-transform",
                  modal.decreaseTrustOnDecision
                    ? "translate-x-[18px] bg-[#e16162]"
                    : "translate-x-[2px] bg-[#abd1c6]/60",
                ].join(" ")}
              />
            </span>
          </button>
          <p className="mt-1 text-[11px] text-[#abd1c6]/80">
            При отказе с галкой у пользователя в профиле будет учтено как
            «Отклонено с понижением».
          </p>
        </div>
      </div>
    </GlassModal>
  );
}
