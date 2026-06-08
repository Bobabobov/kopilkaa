"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface StoryPageHeroProps {
  title: string;
  summary?: string;
  author?: string;
  authorId?: string;
  authorAvatar?: string | null;
  createdAt?: string;
  isContestWinner?: boolean;
  readTime?: number;
  imagesCount?: number;
}

function MetaDot() {
  return (
    <span className="hidden sm:inline text-[#abd1c6]/35" aria-hidden>
      ·
    </span>
  );
}

export function StoryPageHero({
  title,
  summary,
  author,
  authorId,
  authorAvatar,
  createdAt,
  isContestWinner = false,
  readTime = 1,
  imagesCount = 0,
}: StoryPageHeroProps) {
  const safeAuthorAvatar = resolveAvatarUrl(authorAvatar);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <header className="border-b border-white/[0.08] pb-6 sm:pb-7">
      <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f9bc60]/85">
          История
        </span>
        {isContestWinner && (
          <>
            <MetaDot />
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#f9bc60]">
              <LucideIcons.Trophy size="xs" />
              Победитель конкурса
            </span>
          </>
        )}
      </div>

      <h1 className="max-w-3xl text-2xl sm:text-[1.75rem] lg:text-[2rem] font-black leading-snug tracking-tight text-[#fffffe]">
        {title}
      </h1>

      {summary && (
        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-[#abd1c6]/80">
          {summary}
        </p>
      )}

      <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#abd1c6]/75">
        {author &&
          (authorId ? (
            <Link
              href={`/profile/${authorId}`}
              className="inline-flex items-center gap-2 rounded-lg transition-colors hover:text-[#f9bc60]"
            >
              <img
                src={safeAuthorAvatar}
                alt={author}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <span className="font-medium text-[#abd1c6]">{author}</span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-2">
              <img
                src={safeAuthorAvatar}
                alt={author}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <span className="font-medium text-[#abd1c6]">{author}</span>
            </span>
          ))}

        {author && formattedDate && <MetaDot />}

        {formattedDate && (
          <time dateTime={createdAt} className="text-[#abd1c6]/70">
            {formattedDate}
          </time>
        )}

        <MetaDot />

        <span className="inline-flex items-center gap-1.5 text-[#abd1c6]/70">
          <LucideIcons.Clock size="xs" className="text-[#f9bc60]/70" />
          {readTime} мин
        </span>

        {imagesCount > 0 && (
          <>
            <MetaDot />
            <span className="inline-flex items-center gap-1.5 text-[#abd1c6]/70">
              <LucideIcons.Image size="xs" className="text-[#f9bc60]/70" />
              {imagesCount}{" "}
              {imagesCount === 1
                ? "фото"
                : imagesCount < 5
                  ? "фото"
                  : "фото"}
            </span>
          </>
        )}
      </div>

      <div
        className={cn(
          "mt-5 h-px w-full max-w-xs",
          "bg-gradient-to-r from-[#f9bc60]/50 via-[#abd1c6]/30 to-transparent",
        )}
        aria-hidden
      />
    </header>
  );
}
