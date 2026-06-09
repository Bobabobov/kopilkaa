"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import { VKIcon } from "@/components/ui/icons/VKIcon";
import { YouTubeIcon } from "@/components/ui/icons/YouTubeIcon";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { buildUploadUrl } from "@/lib/uploads/url";
import { UserPublicBadges } from "@/components/users/UserPublicBadges";
import { cn } from "@/lib/utils";
import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

type Props = {
  authorName: string;
  authorId: string;
  authorAvatar?: string | null;
  authorUsername?: string | null;
  markedAsDeceiver?: boolean;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
};

export function GoodDeedDeedSidebar({
  authorName,
  authorId,
  authorAvatar,
  authorUsername,
  markedAsDeceiver,
  vkLink,
  telegramLink,
  youtubeLink,
}: Props) {
  const avatarUrl = buildUploadUrl(resolveAvatarUrl(authorAvatar), {
    variant: "thumb",
  });

  const hasSocial = Boolean(vkLink || telegramLink || youtubeLink);

  return (
    <aside className="hidden lg:block" aria-label="Автор отчёта">
      <div
        className="sticky"
        style={{ top: "calc(var(--header-offset, 56px) + 1.25rem)" }}
      >
        <div className={cn(storiesGlassCard, "p-5")}>
          <div className={storiesGlassShine} />
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80">
            Участник
          </p>
          <Link
            href={`/profile/${authorId}`}
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-[#f9bc60]/30"
          >
            <img
              src={avatarUrl}
              alt={authorName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[#001e1d]/50"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate font-semibold text-[#fffffe] transition-colors group-hover:text-[#f9bc60]">
                <span className="truncate">{authorName}</span>
                <UserPublicBadges markedAsDeceiver={markedAsDeceiver} />
              </p>
              <p className="truncate text-xs text-[#abd1c6]/70">
                {authorUsername ? `@${authorUsername}` : "Профиль участника"}
              </p>
            </div>
            <LucideIcons.ArrowRight
              size="sm"
              className="ml-auto shrink-0 text-[#abd1c6]/50 transition-colors group-hover:text-[#f9bc60]"
            />
          </Link>

          {hasSocial ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {vkLink ? (
                <a
                  href={vkLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#4c75a3]/45 bg-[#4c75a3]/12 px-3 py-1 text-xs font-semibold text-[#8babd9] transition hover:bg-[#4c75a3]/20"
                >
                  <VKIcon className="h-4 w-4" />
                  VK
                </a>
              ) : null}
              {telegramLink ? (
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#229ED9]/45 bg-[#229ED9]/12 px-3 py-1 text-xs font-semibold text-[#7ccff0] transition hover:bg-[#229ED9]/20"
                >
                  <TelegramIcon className="h-4 w-4" />
                  Telegram
                </a>
              ) : null}
              {youtubeLink ? (
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#ff4f45]/45 bg-[#ff4f45]/12 px-3 py-1 text-xs font-semibold text-[#ffa8a3] transition hover:bg-[#ff4f45]/20"
                >
                  <YouTubeIcon className="h-4 w-4" />
                  YouTube
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
