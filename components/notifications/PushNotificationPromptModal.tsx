"use client";

import { LucideIcons } from "@/components/ui/LucideIcons";
import { GlassModal } from "@/components/ui/GlassModal";
import { PUSH_PROMPT_FEATURES } from "@/lib/notifications/browserNotifications";

interface PushNotificationPromptModalProps {
  open: boolean;
  enabling: boolean;
  onClose: () => void;
  onEnable: () => void;
  onLater: () => void;
}

function BellVisual() {
  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-[#f9bc60]/20 blur-md" aria-hidden />
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#f9bc60]/40 bg-gradient-to-br from-[#f9bc60]/25 to-[#004643]/80 shadow-[0_0_24px_rgba(249,188,96,0.25)]">
        <LucideIcons.Bell className="h-7 w-7 text-[#f9bc60]" />
      </div>
    </div>
  );
}

function PushNotificationPromptContent({
  enabling,
  onClose,
  onEnable,
  onLater,
}: Omit<PushNotificationPromptModalProps, "open">) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="h-1 w-full bg-gradient-to-r from-[#f9bc60] via-[#abd1c6] to-[#004643]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f9bc60]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <BellVisual />

          <div className="min-w-0 flex-1 pt-0.5">
            <span className="mb-2 inline-block text-[10px] font-bold uppercase tracking-[0.14em] text-[#abd1c6]/70">
              Уведомления
            </span>
            <h2
              id="push-prompt-title"
              className="text-xl font-black leading-tight text-[#fffffe] sm:text-2xl"
            >
              Включите уведомления
            </h2>
            <p
              id="push-prompt-desc"
              className="mt-2 text-sm leading-relaxed text-[#abd1c6]"
            >
              Получайте уведомления о новых сообщениях, реакциях, комментариях и
              важных обновлениях платформы
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={enabling}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#abd1c6] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-[#fffffe] disabled:opacity-40"
            aria-label="Закрыть"
          >
            <LucideIcons.X className="h-4 w-4" />
          </button>
        </div>

        <ul className="mt-5 space-y-3">
          {PUSH_PROMPT_FEATURES.map((feature) => (
            <li
              key={feature.id}
              className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/15 text-[#f9bc60]">
                <LucideIcons.Check className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#fffffe]">
                  {feature.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]/90">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onLater}
            disabled={enabling}
            className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-[#abd1c6] transition-colors hover:border-white/20 hover:bg-white/10 hover:text-[#fffffe] disabled:opacity-40"
          >
            Позже
          </button>
          <button
            type="button"
            onClick={onEnable}
            disabled={enabling}
            className="min-h-[44px] rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-5 py-2.5 text-sm font-bold text-[#001e1d] shadow-lg shadow-[#f9bc60]/25 transition-all hover:scale-[1.02] hover:shadow-[#f9bc60]/35 active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
          >
            {enabling ? "Запрос..." : "Включить"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function PushNotificationPromptModal({
  open,
  enabling,
  onClose,
  onEnable,
  onLater,
}: PushNotificationPromptModalProps) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="lg"
      zIndex={75}
      panelClassName="max-w-[480px]"
      hideHeader
      showCloseButton={false}
      closeOnBackdropClick={!enabling}
      bodyClassName="p-0 overflow-hidden"
      ariaLabelledBy="push-prompt-title"
      ariaDescribedBy="push-prompt-desc"
    >
      <PushNotificationPromptContent
        enabling={enabling}
        onClose={onClose}
        onEnable={onEnable}
        onLater={onLater}
      />
    </GlassModal>
  );
}
