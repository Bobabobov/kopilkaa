"use client";

import Link from "next/link";
import { Gift } from "lucide-react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl } from "@/lib/uploads/url";
import { bonusWord } from "@/app/good-deeds/_components/goodDeedsTaskUi";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  summary?: string;
  reward: number;
  authorName: string;
  authorId: string;
  authorAvatar?: string | null;
  authorUsername?: string | null;
  createdAt: string;
  readTime: number;
  mediaCount: number;
};

function MetaDot() {
  return (
    <span className="hidden sm:inline text-[#abd1c6]/35" aria-hidden>
      ·
    </span>
  );
}

export function GoodDeedDeedHero({
  title,
  summary,
  reward,
  authorName,
  authorId,
  authorAvatar,
  authorUsername,
  createdAt,
  readTime,
  mediaCount,
}: Props) {
  const avatarUrl = buildUploadUrl(resolveAvatarUrl(authorAvatar), {
    variant: "thumb",
  });

  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="border-b border-white/[0.08] pb-6 sm:pb-7">
      <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-4">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#f9bc60]/85">
          Доброе дело
        </span>
        <MetaDot />
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#f9bc60]">
          <Gift className="h-3 w-3" aria-hidden />
          +{reward} {bonusWord(reward)}
        </span>
      </div>

      <h1 className="max-w-3xl text-2xl font-black leading-snug tracking-tight text-[#fffffe] sm:text-[1.75rem] lg:text-[2rem]">
        {title}
      </h1>

      {summary ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#abd1c6]/80 sm:text-base">
          {summary}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-[#abd1c6]/75 sm:mt-5">
        <Link
          href={`/profile/${authorId}`}
          className="inline-flex min-w-0 items-center gap-2 rounded-lg transition-colors hover:text-[#f9bc60]"
        >
          <img
            src={avatarUrl}
            alt={authorName}
            className="h-7 w-7 rounded-full object-cover ring-1 ring-white/15"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
          <span className="truncate font-medium text-[#abd1c6]">
            {authorName}
          </span>
        </Link>

        {authorUsername ? (
          <>
            <MetaDot />
            <span className="text-[#abd1c6]/60">@{authorUsername}</span>
          </>
        ) : null}

        <MetaDot />

        <time dateTime={createdAt} className="text-[#abd1c6]/70">
          {formattedDate}
        </time>

        <MetaDot />

        <span className="inline-flex items-center gap-1.5 text-[#abd1c6]/70">
          <LucideIcons.Clock size="xs" className="text-[#f9bc60]/70" />
          {readTime} мин
        </span>

        {mediaCount > 0 ? (
          <>
            <MetaDot />
            <span className="inline-flex items-center gap-1.5 text-[#abd1c6]/70">
              <LucideIcons.Image size="xs" className="text-[#f9bc60]/70" />
              {mediaCount} {mediaCount === 1 ? "файл" : "файла"}
            </span>
          </>
        ) : null}
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
