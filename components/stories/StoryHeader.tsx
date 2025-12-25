// components/stories/StoryHeader.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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
    <div className="mb-8">
      {isAd && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-xl border-2 border-[#f9bc60] bg-gradient-to-r from-[#f9bc60]/20 via-[#f9bc60]/15 to-[#f9bc60]/20 backdrop-blur-sm text-sm font-black uppercase tracking-wider text-[#f9bc60] shadow-lg shadow-[#f9bc60]/20"
        >
          <span className="w-2 h-2 rounded-full bg-[#f9bc60] animate-pulse"></span>
          <span>РЕКЛАМНАЯ ИСТОРИЯ</span>
          <span className="w-2 h-2 rounded-full bg-[#f9bc60] animate-pulse"></span>
        </motion.div>
      )}
      <h1
        className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4 transition-all duration-500 ${
          isAd ? "bg-gradient-to-r from-[#fffffe] via-[#f9bc60] to-[#fffffe] bg-clip-text text-transparent" : ""
        }`}
        style={isAd ? {} : { color: "#fffffe" }}
      >
        {title}
      </h1>

      {/* Метаданные */}
      {(author || createdAt) && (
        <div
          className="flex flex-wrap items-center gap-4 text-sm mb-4"
          style={{ color: "#abd1c6" }}
        >
          {author && (
            <div className="flex items-center gap-2">
              {authorExternalUrl ? (
                <a
                  href={authorExternalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200 group"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-md border border-white/40">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="group-hover:text-yellow-400 transition-colors duration-200">
                    {author}
                  </span>
                </a>
              ) : authorId ? (
                <Link
                  href={`/profile/${authorId}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={authorAvatar || "/default-avatar.png"}
                      alt={author}
                      className="w-6 h-6 rounded-full object-cover border border-white/20 group-hover:border-yellow-400/50 transition-colors duration-200"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                  <span className="group-hover:text-yellow-400 transition-colors duration-200">
                    {author}
                  </span>
                </Link>
              ) : (
                <span className="flex items-center gap-2">
                  <img
                    src={authorAvatar || "/default-avatar.png"}
                    alt={author}
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                  />
                  {author}
                </span>
              )}
            </div>
          )}
          {createdAt && (
            <span className="flex items-center gap-2">
              📅{" "}
              {new Date(createdAt).toLocaleDateString("ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}

      {/* Декоративная линия */}
      <div className="mt-4 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full w-full"></div>
    </div>
  );
}
