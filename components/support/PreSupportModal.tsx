"use client";

import { GlassModal, GlassModalCloseButton } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface PreSupportModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Обёртка модалки «Поддержать проект»: GlassModal с заголовком и контентом через children.
 */
export function PreSupportModal({
  open,
  onClose,
  children,
}: PreSupportModalProps) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="lg"
      zIndex={999}
      hideHeader
      showCloseButton={false}
      bodyClassName="p-0"
      ariaLabelledBy="pre-support-title"
      ariaDescribedBy="pre-support-desc"
      header={
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#f9bc60] to-[#e8a545] text-[#001e1d] shadow-lg shadow-[#f9bc60]/25">
                <LucideIcons.Heart size="sm" />
              </span>
              <span className="text-xs font-semibold tracking-wide text-[#fffffe]">
                Поддержка проекта
              </span>
            </div>
            <h3
              id="pre-support-title"
              className="mt-3 inline-flex items-center gap-2 text-xl font-black leading-tight text-[#fffffe] sm:text-2xl"
            >
              <LucideIcons.Heart
                className="shrink-0 text-[#f9bc60]"
                size="lg"
              />
              Поддержать «Копилку»
            </h3>
            <p
              id="pre-support-desc"
              className="mt-2 text-sm leading-relaxed text-[#abd1c6]"
            >
              Поддержка помогает «Копилке» развиваться и продолжать работу.
              <span className="mt-2 block rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                Хотите, чтобы мы могли{" "}
                <span className="font-semibold text-[#f9bc60]">
                  публично поблагодарить
                </span>{" "}
                вас в «Героях» — укажите свой логин в сообщении к поддержке.
                Сейчас это{" "}
                <span className="font-semibold text-[#f9bc60]">вручную</span>,
                скоро{" "}
                <span className="font-semibold text-[#f9bc60]">
                  автоматически
                </span>
                .
              </span>
            </p>
          </div>
          <GlassModalCloseButton onClose={onClose} />
        </div>
      }
      footer={
        <div className="text-[11px] leading-relaxed text-[#abd1c6]/80">
          Поддержка добровольная и не является покупкой услуги, инвестицией или
          подпиской.
        </div>
      }
    >
      <div className="space-y-4 p-5 sm:p-6">{children}</div>
    </GlassModal>
  );
}
