"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";

export function StoryMoreStories() {
  return (
    <section
      className="mx-auto max-w-4xl px-0 sm:px-4 mt-10 sm:mt-14"
      aria-label="Ещё истории"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[#94a1b2] mb-4 px-4 sm:px-0">
        Продолжить чтение
      </p>
      <Link
        href="/stories"
        className="group block rounded-2xl border border-[#abd1c6]/25 bg-gradient-to-r from-[#004643]/50 via-[#003d3a]/35 to-[#004643]/50 p-6 sm:p-8 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.2)] transition-all duration-300 hover:border-[#f9bc60]/40 hover:shadow-[0_20px_56px_-24px_rgba(249,188,96,0.15)]"
      >
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f9bc60]/20 border border-[#f9bc60]/40 text-[#f9bc60] transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            <LucideIcons.BookOpen size="lg" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe] group-hover:text-[#f9bc60] transition-colors">
              Читайте другие истории
            </h2>
            <p className="mt-1 text-sm text-[#abd1c6]/90">
              Реальные истории людей, которым помогла платформа Копилка
            </p>
          </div>
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#abd1c6]/20 text-[#abd1c6] transition-all duration-300 group-hover:bg-[#f9bc60]/20 group-hover:text-[#f9bc60]"
            aria-hidden
          >
            <LucideIcons.ArrowRight size="md" />
          </span>
        </div>
      </Link>
    </section>
  );
}
