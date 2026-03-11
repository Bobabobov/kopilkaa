// app/admin/components/StatusModal.tsx
import { motion } from "framer-motion";
import { StatusModal as StatusModalType, ApplicationStatus } from "../types";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StatusModalProps {
  modal: StatusModalType;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
  onCommentChange: (comment: string) => void;
  onDecreaseTrustChange: (next: boolean) => void;
  onPublishChange: (next: boolean) => void;
  onSave: () => Promise<void>;
}

export default function StatusModal({
  modal,
  onClose,
  onStatusChange,
  onCommentChange,
  onDecreaseTrustChange,
  onPublishChange,
  onSave,
}: StatusModalProps) {
  if (!modal.id) return null;
  // «Конкурс» — только пометка для админа, не одобряет и не отклоняет
  const canDecrease =
    modal.status === "APPROVED" || modal.status === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[760px] max-h-[92vh] flex flex-col rounded-2xl border border-white/[0.08] bg-[linear-gradient(165deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_100%)] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.45)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 p-4 sm:p-6 lg:p-7 flex-shrink-0 border-b border-white/10">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 flex-shrink-0">
              <LucideIcons.CheckCircle2 size="sm" className="text-[#f9bc60]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-[#9bb3ab]">
                Изменение заявки
              </p>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-[#fffffe] leading-tight">
                Статус и комментарий
              </h2>
              <p className="mt-1 text-sm text-[#abd1c6]">
                Здесь можно вернуть заявку в «В обработке» или указать причину
                решения.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-[#abd1c6] hover:text-[#fffffe] transition-colors flex-shrink-0"
            aria-label="Закрыть"
          >
            <LucideIcons.X size="sm" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto flex-1 min-h-0 p-4 sm:p-6 lg:p-7">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Новый статус
            </label>
            <select
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/45 focus:border-[#f9bc60]/30 transition-all duration-200 text-[#fffffe] outline-none"
              value={modal.status}
              onChange={(e) => {
                const nextStatus = e.target.value as ApplicationStatus;
                onStatusChange(nextStatus);
                if (nextStatus !== "CONTEST") {
                  onPublishChange(false);
                }
              }}
            >
              <option value="PENDING">⏳ В обработке</option>
              <option value="APPROVED">✅ Одобрено</option>
              <option value="REJECTED">❌ Отказано</option>
              <option value="CONTEST">🏆 Конкурс</option>
            </select>
          </div>

          {modal.status === "CONTEST" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <button
                type="button"
                onClick={() => onPublishChange(!modal.publishInStories)}
                className="w-full flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex w-9 h-9 rounded-xl bg-[#f9bc60]/12 border border-[#f9bc60]/25 items-center justify-center flex-shrink-0">
                    <LucideIcons.Trophy size="sm" className="text-[#f9bc60]" />
                  </span>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold text-[#fffffe]">
                      Публиковать в /stories
                    </p>
                    <p className="text-xs text-[#abd1c6]">
                      Победитель конкурса
                    </p>
                  </div>
                </div>
                <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10 flex-shrink-0">
                  <span
                    className={[
                      "absolute h-4 w-4 rounded-full transition-transform",
                      modal.publishInStories
                        ? "translate-x-[18px] bg-[#10B981]"
                        : "translate-x-[2px] bg-[#abd1c6]/60",
                    ].join(" ")}
                  />
                </span>
              </button>
              <p className="mt-2 text-xs text-[#abd1c6]">
                Если включено — заявка появится в историях и будет выделена
                как победитель конкурса.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Комментарий администратора
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/45 focus:border-[#f9bc60]/30 transition-all duration-200 text-[#fffffe] placeholder:text-[#abd1c6]/60 min-h-[120px] resize-none outline-none"
              value={modal.comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Причина решения / уточнения для автора..."
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
                "w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-colors",
                canDecrease
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-white/5 bg-white/[0.03] opacity-60 cursor-not-allowed",
              ].join(" ")}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex w-9 h-9 rounded-xl bg-[#e16162]/12 border border-[#e16162]/25 items-center justify-center flex-shrink-0">
                  <LucideIcons.AlertTriangle size="sm" className="text-[#e16162]" />
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
              <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10 flex-shrink-0">
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 justify-end pt-2">
            <button
              className="px-5 py-2.5 rounded-2xl transition-colors border border-white/10 bg-white/5 text-[#abd1c6] hover:bg-white/10 hover:border-white/20"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              className="px-5 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] text-[#0f2d2a] rounded-2xl transition-colors font-bold shadow-lg hover:shadow-[#f9bc60]/20"
              onClick={onSave}
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
