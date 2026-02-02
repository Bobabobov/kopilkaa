// components/stories/StoryHeader.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface StoryHeaderProps {
  title: string;
  author?: string;
  authorId?: string;
  authorAvatar?: string | null;
  createdAt?: string;
  isAd?: boolean;
  authorExternalUrl?: string;
}

export default function StoryHeader({
  title,
  author,
  authorId,
  authorAvatar,
  createdAt,
  isAd = false,
  authorExternalUrl,
}: StoryHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10 min-w-0">
      {isAd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-xl border border-[#f9bc60]/50 bg-[#f9bc60]/10 text-sm font-bold uppercase tracking-wider text-[#f9bc60]"
        >
          <span className="w-2 h-2 rounded-full bg-[#f9bc60] animate-pulse" />
          <span>Рекламная история</span>
          <span className="w-2 h-2 rounded-full bg-[#f9bc60] animate-pulse" />
        </motion.div>
      )}

      <h1
        className={`max-w-full break-words text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-5 tracking-tight ${
          isAd
            ? "bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent"
            : "text-[#fffffe]"
        }`}
      >
        {title}
      </h1>

      {(author || createdAt) && (
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm">
          {author && (
            <div className="flex items-center gap-2">
              {authorExternalUrl ? (
                <a
                  href={authorExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/40 px-3 py-2 text-[#abd1c6] transition-all duration-300 hover:border-[#f9bc60]/50 hover:text-[#f9bc60]"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#abd1c6]/30 to-[#004643]/50 flex items-center justify-center border border-[#abd1c6]/40">
                    <LucideIcons.ExternalLink size="xs" className="text-[#f9bc60]" />
                  </div>
                  <span>{author}</span>
                </a>
              ) : authorId ? (
                <Link
                  href={`/profile/${authorId}`}
                  className="flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/40 px-3 py-2 text-[#abd1c6] transition-all duration-300 hover:border-[#f9bc60]/50 hover:text-[#f9bc60]"
                >
                  <img
                    src={authorAvatar || "/default-avatar.png"}
                    alt={author}
                    className="h-8 w-8 rounded-full object-cover border border-[#abd1c6]/40 ring-2 ring-[#001e1d]/50"
                  />
                  <span>{author}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2 rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/30 px-3 py-2 text-[#abd1c6]">
                  <img
                    src={authorAvatar || "/default-avatar.png"}
                    alt={author}
                    className="h-8 w-8 rounded-full object-cover border border-[#abd1c6]/40"
                  />
                  {author}
                </span>
              )}
            </div>
          )}
          {createdAt && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/30 px-3 py-2 text-[#abd1c6]">
              <LucideIcons.Calendar size="sm" />
              {new Date(createdAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 h-1 w-full rounded-full bg-gradient-to-r from-[#f9bc60]/60 via-[#abd1c6]/50 to-[#f9bc60]/40" />
    </header>
  );
}
