"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";

interface PreSupportModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Обёртка модалки «Поддержать проект»: фон, карточка с градиентом, заголовок и кнопка закрытия.
 * Контент (блоки по статусу профиля) передаётся через children.
 */
export function PreSupportModal({ onClose, children }: PreSupportModalProps) {
  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="pre-support-title"
        aria-describedby="pre-support-desc"
        className="w-full max-w-lg"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-[28px] p-px bg-gradient-to-br from-[#f9bc60]/70 via-white/10 to-[#abd1c6]/50 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.85)]">
          <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[#f9bc60]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-[#abd1c6]/18 blur-3xl" />

          <div className="relative overflow-hidden rounded-[27px] bg-gradient-to-br from-[#004643] via-[#003b38] to-[#001e1d]">
            <div className="absolute inset-0 pointer-events-none opacity-[0.35] [background:radial-gradient(circle_at_30%_20%,rgba(249,188,96,0.28),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(171,209,198,0.18),transparent_55%)]" />

            <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-lg shadow-[#f9bc60]/25">
                    <LucideIcons.Heart size="sm" />
                  </span>
                  <span className="text-xs font-semibold tracking-wide text-[#fffffe]">
                    Поддержка проекта
                  </span>
                </div>
                <h3
                  id="pre-support-title"
                  className="mt-3 text-xl sm:text-2xl font-black text-[#fffffe] leading-tight"
                >
                  💚 Поддержать «Копилку»
                </h3>
                <p
                  id="pre-support-desc"
                  className="mt-2 text-sm text-[#abd1c6] leading-relaxed"
                >
                  Поддержка помогает «Копилке» развиваться и продолжать работу.
                  <span className="block mt-2 rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
                    Хотите, чтобы мы могли{" "}
                    <span className="text-[#f9bc60] font-semibold">
                      публично поблагодарить
                    </span>{" "}
                    вас в «Героях» — укажите свой логин в сообщении к поддержке.
                    Сейчас это{" "}
                    <span className="text-[#f9bc60] font-semibold">
                      вручную
                    </span>
                    , скоро{" "}
                    <span className="text-[#f9bc60] font-semibold">
                      автоматически
                    </span>
                    .
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0 border border-white/10"
                aria-label="Закрыть"
              >
                <LucideIcons.X size="sm" className="text-[#fffffe]" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">{children}</div>

            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
              <div className="text-[11px] text-[#abd1c6]/80 leading-relaxed">
                Поддержка добровольная и не является покупкой услуги,
                инвестицией или подпиской.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
