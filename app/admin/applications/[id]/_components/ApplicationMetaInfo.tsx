// app/admin/applications/[id]/components/ApplicationMetaInfo.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ApplicationMetaInfoProps {
  amount: number;
  userId: string;
  userName?: string | null;
  userAvatar?: string | null;
  userEmail: string;
  summary: string;
  onCopyEmail: (email: string) => void;
  filledMs?: number | null;
  /** Локализованное название категории помощи */
  categoryLabel?: string | null;
}

function getAuthorLabel(
  name: string | null | undefined,
  email: string,
): string {
  if (name?.trim()) return name.trim();
  const local = email.split("@")[0]?.trim();
  return local || "Пользователь";
}

export default function ApplicationMetaInfo({
  amount,
  userId,
  userName,
  userAvatar,
  userEmail,
  summary,
  onCopyEmail,
  filledMs,
  categoryLabel,
}: ApplicationMetaInfoProps) {
  const authorLabel = getAuthorLabel(userName, userEmail);
  const avatarUrl = resolveAvatarUrl(userAvatar);
  const formattedTime = (() => {
    if (typeof filledMs !== "number" || !Number.isFinite(filledMs)) return null;
    const totalSec = Math.max(0, Math.round(filledMs / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return `${sec} c`;
    return `${min} мин ${sec.toString().padStart(2, "0")} c`;
  })();

  return (
    <>
      {/* Сумма, автор и краткое описание */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6"
      >
        {/* Сумма запроса */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-[#f9bc60]/40 bg-[#f9bc60]/10 backdrop-blur-sm min-w-0 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
          <span className="font-bold text-xl sm:text-2xl text-[#f9bc60]">
            ₽{amount.toLocaleString()}
          </span>
          <span className="text-xs sm:text-sm font-medium text-[#abd1c6]">
            Сумма запроса
          </span>
        </div>

        {/* Автор */}
        <div className="rounded-2xl border border-[#abd1c6]/35 bg-[#001e1d]/40 backdrop-blur-sm min-w-0 overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.28)] p-2.5 sm:p-3">
          <div className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]/80 mb-2">
            Автор
          </div>
          <Link
            href={`/profile/${userId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 min-w-0 rounded-xl border border-transparent px-1 py-0.5 -mx-1 transition-colors hover:border-[#f9bc60]/30 hover:bg-white/5"
            title="Открыть профиль автора"
          >
            <img
              src={avatarUrl}
              alt=""
              className="h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 rounded-full object-cover ring-2 ring-[#abd1c6]/25 group-hover:ring-[#f9bc60]/45 transition-all"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm sm:text-base font-bold text-[#f9bc60] group-hover:text-[#e8a545] group-hover:underline">
                {authorLabel}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[#abd1c6]/75">
                <LucideIcons.ExternalLink size="xs" />
                Профиль
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => onCopyEmail(userEmail)}
            className="mt-2 group flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-left transition-all duration-200 hover:border-[#f9bc60]/40 hover:bg-white/10"
            title="Нажмите, чтобы скопировать email"
          >
            <LucideIcons.Mail size="xs" className="flex-shrink-0 text-[#abd1c6]/70" />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#abd1c6]">
              {userEmail.replace(/(.{2}).*(@.*)/, "$1***$2")}
            </span>
            <LucideIcons.Copy size="xs" className="flex-shrink-0 text-[#f9bc60]/80 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Время заполнения */}
        {formattedTime && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl border border-[#abd1c6]/35 bg-[#004643]/50 backdrop-blur-sm min-w-0 shadow-[0_12px_30px_rgba(0,0,0,0.28)]">
            <span className="font-semibold text-lg sm:text-xl text-[#abd1c6]">
              {formattedTime}
            </span>
            <span className="text-xs sm:text-sm font-medium text-[#94a1b2]">
              Время заполнения формы
            </span>
          </div>
        )}
      </motion.div>

      {/* Категория помощи */}
      {categoryLabel ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 }}
          className="mb-4"
        >
          <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-[#abd1c6]/35 bg-[#001e1d]/45 px-3 py-2 sm:px-4 sm:py-2.5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
              Категория
            </span>
            <span className="text-sm font-semibold text-[#f9bc60]">
              {categoryLabel}
            </span>
          </div>
        </motion.div>
      ) : null}

      {/* Краткое описание */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-6"
      >
        <div className="text-sm sm:text-base lg:text-lg break-words leading-relaxed rounded-2xl border border-[#abd1c6]/30 bg-[#004643]/60 backdrop-blur-sm p-3 sm:p-5 lg:p-6 min-w-0 text-[#e8f2ef] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
          {summary}
        </div>
      </motion.div>
    </>
  );
}
