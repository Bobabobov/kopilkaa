"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { DEFAULT_AVATAR, resolveAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";
import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

interface StoryPageSidebarProps {
  author?: string;
  authorId?: string;
  authorAvatar?: string | null;
}

export function StoryPageSidebar({
  author,
  authorId,
  authorAvatar,
}: StoryPageSidebarProps) {
  const safeAuthorAvatar = resolveAvatarUrl(authorAvatar);

  if (!author || !authorId) {
    return null;
  }

  return (
    <aside className="hidden lg:block" aria-label="Автор истории">
      <div
        className="sticky"
        style={{ top: "calc(var(--header-offset, 56px) + 1.25rem)" }}
      >
        <div className={cn(storiesGlassCard, "p-5")}>
          <div className={storiesGlassShine} />
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80 mb-4">
            Автор
          </p>
          <Link
            href={`/profile/${authorId}`}
            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition-colors hover:border-[#f9bc60]/30"
          >
            <img
              src={safeAuthorAvatar}
              alt={author}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-[#001e1d]/50"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
                {author}
              </p>
              <p className="text-xs text-[#abd1c6]/70">Профиль автора</p>
            </div>
            <LucideIcons.ArrowRight
              size="sm"
              className="ml-auto shrink-0 text-[#abd1c6]/50 group-hover:text-[#f9bc60] transition-colors"
            />
          </Link>
        </div>
      </div>
    </aside>
  );
}
