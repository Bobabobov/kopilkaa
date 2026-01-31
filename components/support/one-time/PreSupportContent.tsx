import { LucideIcons } from "@/components/ui/LucideIcons";
import type { PreSupportProfile } from "./types";

interface PreSupportContentProps {
  profile: PreSupportProfile | null;
  suggestedTag: string;
  dalinkUrl: string;
  authUrl: string;
  onClose: () => void;
  onCopy: (text: string) => void;
}

export function PreSupportContent({
  profile,
  suggestedTag,
  dalinkUrl,
  authUrl,
  onClose,
  onCopy,
}: PreSupportContentProps) {
  if (profile?.isAuthed === false) {
    return (
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
              <span className="text-[#f9bc60] font-semibold">без аккаунта</span>
              , мы{" "}
              <span className="text-[#f9bc60] font-semibold">не сможем</span>{" "}
              добавить вас в «Герои» (нам не к чему привязать поддержку).
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
            💚 Поддержать проект
            <LucideIcons.ExternalLink size="sm" />
          </a>

          <a
            href={authUrl}
            className="sm:flex-1 px-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 text-[#fffffe] text-sm font-semibold transition-colors inline-flex items-center justify-center gap-2 border border-white/15"
          >
            <LucideIcons.UserPlus size="sm" />
            Войти (для «Героев»)
          </a>
        </div>
      </div>
    );
  }

  if (profile?.isAuthed === true && profile.username) {
    return (
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
              Если вы хотите, чтобы мы могли поблагодарить вас публично, укажите
              этот логин в сообщении к поддержке (пока добавление в «Герои» —
              вручную).
            </p>
          </div>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-[#001e1d]/30 rounded-2xl text-[#fffffe] border border-[#abd1c6]/15 break-all">
            {suggestedTag}
          </div>
          <button
            type="button"
            onClick={() => onCopy(suggestedTag)}
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
            💚 Поддержать проект
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
    );
  }

  if (profile?.isAuthed === true) {
    return (
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
              Если хотите попасть в «Герои», задайте логин в профиле (ссылка
              будет вида{" "}
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
            💚 Поддержать проект
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
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="text-sm font-semibold text-[#fffffe]">
        Проверяем статус аккаунта…
      </div>
      <p className="mt-2 text-sm text-[#abd1c6]">
        Если вы не авторизованы, можно поддержать проект без регистрации — но
        тогда мы не сможем добавить вас в «Герои».
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
          💚 Поддержать проект
          <LucideIcons.ExternalLink size="sm" />
        </a>
      </div>
    </div>
  );
}
