"use client";

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
  if (!isOpen) return null;

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
                  className="mt-3 text-xl sm:text-2xl font-black text-[#fffffe] leading-tight inline-flex items-center gap-2"
                >
                  <LucideIcons.Heart className="text-[#f9bc60] flex-shrink-0" size="lg" />
                  Поддержать «Копилку»
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

            <div className="p-5 sm:p-6 space-y-4">
              {profile?.isAuthed === false ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Info size="sm" className="text-[#abd1c6]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#fffffe]">
                        Можно поддержать прямо сейчас
                      </div>
                      <p className="mt-2 text-sm text-[#abd1c6] leading-relaxed">
                        Регистрация не обязательна. Но если поддержать{" "}
                        <span className="text-[#f9bc60] font-semibold">
                          без аккаунта
                        </span>
                        , мы{" "}
                        <span className="text-[#f9bc60] font-semibold">
                          не сможем
                        </span>{" "}
                        добавить вас в «Герои» (нам не к чему привязать
                        поддержку).
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                    <a
                      href={dalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <LucideIcons.Heart
                        size="sm"
                        className="group-hover:scale-110 transition-transform"
                      />
                      Поддержать проект
                      <LucideIcons.ExternalLink size="sm" />
                    </a>

                    <a
                      href={authSignupUrl}
                      className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
                    >
                      <LucideIcons.UserPlus size="sm" />
                      Войти (для «Героев»)
                    </a>
                  </div>
                </div>
              ) : profile?.isAuthed === true && profile.username ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Star size="sm" className="text-[#f9bc60]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#fffffe]">
                        Опционально: логин для «Героев»
                      </div>
                      <p className="mt-2 text-xs sm:text-sm text-[#abd1c6] leading-relaxed">
                        Если вы хотите, чтобы мы могли поблагодарить вас
                        публично, укажите этот логин в сообщении к поддержке
                        (пока добавление в «Герои» — вручную).
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1 px-4 py-3 bg-[#001e1d]/30 rounded-2xl text-[#fffffe] border border-[#abd1c6]/15 break-all">
                      {suggestedTag}
                    </div>
                    <button
                      type="button"
                      onClick={onCopyLogin}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-[#fffffe] text-sm font-semibold rounded-2xl transition-colors inline-flex items-center justify-center gap-2 border border-white/10"
                    >
                      <LucideIcons.Copy size="sm" />
                      Скопировать логин
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                    <a
                      href={dalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <LucideIcons.Heart
                        size="sm"
                        className="group-hover:scale-110 transition-transform"
                      />
                      Поддержать проект
                      <LucideIcons.ExternalLink size="sm" />
                    </a>
                    <a
                      href={dalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
                    >
                      Поддержать без упоминания
                    </a>
                  </div>
                </div>
              ) : profile?.isAuthed === true ? (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <LucideIcons.Heart size="sm" className="text-[#abd1c6]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#fffffe]">
                        Поддержать можно и без логина
                      </div>
                      <p className="mt-2 text-sm text-[#abd1c6] leading-relaxed">
                        Если хотите попасть в «Герои», задайте логин в профиле
                        (ссылка будет вида{" "}
                        <span className="text-[#f9bc60] font-semibold">
                          /profile/@логин
                        </span>
                        ). Это необязательно.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:items-stretch">
                    <a
                      href={dalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group sm:flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <LucideIcons.Heart
                        size="sm"
                        className="group-hover:scale-110 transition-transform"
                      />
                      Поддержать проект
                      <LucideIcons.ExternalLink size="sm" />
                    </a>
                    <a
                      href="/profile?settings=username"
                      className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
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
                    Если вы не авторизованы, можно поддержать проект без
                    регистрации — но тогда мы не сможем добавить вас в «Герои».
                  </p>
                  <div className="mt-4">
                    <a
                      href={dalinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group px-4 py-3 rounded-2xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] text-[#001e1d] text-sm font-black transition-all duration-200 inline-flex items-center justify-center gap-2 w-full shadow-lg shadow-[#f9bc60]/20 hover:shadow-xl hover:shadow-[#f9bc60]/25 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <LucideIcons.Heart
                        size="sm"
                        className="group-hover:scale-110 transition-transform"
                      />
                      Поддержать проект
                      <LucideIcons.ExternalLink size="sm" />
                    </a>
                  </div>
                </div>
              )}
            </div>

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
