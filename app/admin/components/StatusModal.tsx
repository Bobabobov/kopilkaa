// app/admin/components/StatusModal.tsx
import { motion } from "framer-motion";
import { StatusModal as StatusModalType, ApplicationStatus } from "../types";

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
  if (!modal.id) return null;
  const canDecrease = modal.status === "APPROVED" || modal.status === "REJECTED";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 bg-black/65"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="relative w-full max-w-[720px] rounded-2xl border border-[#2c4f45]/70 bg-[#0f2622] shadow-xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 bg-[#004643]/60 rounded-xl flex items-center justify-center border border-[#abd1c6]/20 flex-shrink-0">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.14em] text-[#9bb3ab]">
                Изменение заявки
              </p>
              <h2 className="mt-1 text-lg sm:text-xl font-semibold text-[#f7fbf9] leading-tight">
                Статус и комментарий
              </h2>
              <p className="mt-1 text-sm text-[#cfdcd6]">
                Здесь можно вернуть заявку в «В обработке» или указать причину решения.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/5 text-[#9bb3ab] hover:text-[#f7fbf9] transition-colors flex-shrink-0"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Новый статус
            </label>
            <select
              className="w-full px-4 py-3 bg-[#0e2420] border border-[#2c4f45]/70 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/50 focus:border-[#2c4f45] transition-all duration-200 text-[#f7fbf9]"
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
            <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-2 sm:mb-3">
              Комментарий администратора
            </label>
            <textarea
              className="w-full px-4 py-3 bg-[#0e2420] border border-[#2c4f45]/70 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/50 focus:border-[#2c4f45] transition-all duration-200 text-[#f7fbf9] placeholder:text-[#9bb3ab] min-h-[120px] resize-none"
              value={modal.comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Причина решения / уточнения для автора..."
            />
            <p className="mt-2 text-xs text-[#9bb3ab]">
              Этот комментарий увидит пользователь в уведомлении и в модальном окне.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs sm:text-sm text-[#cfdcd6]">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={modal.decreaseTrustOnDecision}
              onChange={(e) => onDecreaseTrustChange(e.target.checked)}
              disabled={!canDecrease}
            />
            <span>Понизить уровень на 1 (при решении)</span>
          </label>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 justify-end pt-2">
            <button
              className="px-5 py-2.5 bg-[#0e2420] hover:bg-[#12312b] text-[#cfdcd6] rounded-2xl transition-colors border border-[#2c4f45]/70"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              className="px-5 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] text-[#001e1d] rounded-2xl transition-colors font-semibold shadow-lg"
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







