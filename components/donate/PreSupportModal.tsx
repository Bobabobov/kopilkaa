"use client";

import { GlassModal, GlassModalCloseButton } from "@/components/ui/GlassModal";
import { LucideIcons } from "@/components/ui/LucideIcons";

type ProfileState = { username: string | null; isAuthed: boolean } | null;

type Props = {
  isOpen: boolean;
  profile: ProfileState;
  suggestedTag: string;
  authSignupUrl: string;
  dalinkUrl: string;
  onClose: () => void;
  onCopyLogin: () => void;
};

export function PreSupportModal({
  isOpen,
  profile,
  suggestedTag,
  authSignupUrl,
  dalinkUrl,
  onClose,
  onCopyLogin,
}: Props) {
  return (
    <GlassModal
      open={isOpen}
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
      <div className="space-y-4 p-5 sm:p-6">
        {profile?.isAuthed === false ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <LucideIcons.Info size="sm" className="text-[#abd1c6]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#fffffe]">
                  Можно поддержать прямо сейчас
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]">
                  Регистрация не обязательна. Но если поддержать{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    без аккаунта
                  </span>
                  , мы{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    не сможем
                  </span>{" "}
                  добавить вас в «Герои» (нам не к чему привязать поддержку).
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <a
                href={dalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-4 py-3 text-sm font-black text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f9bc60]/25 active:translate-y-0"
              >
                <LucideIcons.Heart
                  size="sm"
                  className="transition-transform group-hover:scale-110"
                />
                Поддержать проект
                <LucideIcons.ExternalLink size="sm" />
              </a>

              <a
                href={authSignupUrl}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-[#fffffe] transition-colors hover:bg-white/5"
              >
                <LucideIcons.UserPlus size="sm" />
                Войти (для «Героев»)
              </a>
            </div>
          </div>
        ) : profile?.isAuthed === true && profile.username ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <LucideIcons.Star size="sm" className="text-[#f9bc60]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#fffffe]">
                  Опционально: логин для «Героев»
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#abd1c6] sm:text-sm">
                  Если вы хотите, чтобы мы могли поблагодарить вас публично,
                  укажите этот логин в сообщении к поддержке (пока добавление в
                  «Герои» — вручную).
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex-1 break-all rounded-2xl border border-[#abd1c6]/15 bg-[#001e1d]/30 px-4 py-3 text-[#fffffe]">
                {suggestedTag}
              </div>
              <button
                type="button"
                onClick={onCopyLogin}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-[#fffffe] transition-colors hover:bg-white/10"
              >
                <LucideIcons.Copy size="sm" />
                Скопировать логин
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <a
                href={dalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-4 py-3 text-sm font-black text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f9bc60]/25 active:translate-y-0"
              >
                <LucideIcons.Heart
                  size="sm"
                  className="transition-transform group-hover:scale-110"
                />
                Поддержать проект
                <LucideIcons.ExternalLink size="sm" />
              </a>
              <a
                href={dalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-[#fffffe] transition-colors hover:bg-white/5"
              >
                Поддержать без упоминания
              </a>
            </div>
          </div>
        ) : profile?.isAuthed === true ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <LucideIcons.Heart size="sm" className="text-[#abd1c6]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#fffffe]">
                  Поддержать можно и без логина
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#abd1c6]">
                  Если хотите попасть в «Герои», задайте логин в профиле (ссылка
                  будет вида{" "}
                  <span className="font-semibold text-[#f9bc60]">
                    /profile/@логин
                  </span>
                  ). Это необязательно.
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <a
                href={dalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-4 py-3 text-sm font-black text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f9bc60]/25 active:translate-y-0"
              >
                <LucideIcons.Heart
                  size="sm"
                  className="transition-transform group-hover:scale-110"
                />
                Поддержать проект
                <LucideIcons.ExternalLink size="sm" />
              </a>
              <a
                href="/profile?settings=username"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-transparent px-4 py-3 text-sm font-semibold text-[#fffffe] transition-colors hover:bg-white/5"
              >
                <LucideIcons.Settings size="sm" />
                Задать логин (для «Героев»)
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="text-sm font-semibold text-[#fffffe]">
              Проверяем статус аккаунта…
            </div>
            <p className="mt-2 text-sm text-[#abd1c6]">
              Если вы не авторизованы, можно поддержать проект без регистрации —
              но тогда мы не сможем добавить вас в «Герои».
            </p>
            <div className="mt-4">
              <a
                href={dalinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-4 py-3 text-sm font-black text-[#001e1d] shadow-lg shadow-[#f9bc60]/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#f9bc60]/25 active:translate-y-0"
              >
                <LucideIcons.Heart
                  size="sm"
                  className="transition-transform group-hover:scale-110"
                />
                Поддержать проект
                <LucideIcons.ExternalLink size="sm" />
              </a>
            </div>
          </div>
        )}
      </div>
    </GlassModal>
  );
}
