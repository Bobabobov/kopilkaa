"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

export function StoryMoreStories() {
  return (
    <section
      className="mt-12 sm:mt-16"
      aria-label="Ещё истории"
    >
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80">
        Продолжить чтение
      </p>
      <Link
        href="/stories"
        className={cn(
          storiesGlassCard,
          "group block p-6 sm:p-8",
          "hover:border-[#f9bc60]/30 hover:shadow-[0_18px_44px_-14px_rgba(249,188,96,0.2)]",
        )}
      >
        <div className={storiesGlassShine} />
        <div className="relative flex flex-wrap items-center gap-4 sm:gap-6">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#f9bc60]/30 bg-[#f9bc60]/15 text-[#f9bc60] transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            <LucideIcons.BookOpen size="lg" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe] transition-colors group-hover:text-[#f9bc60]">
              Читайте другие истории
            </h2>
            <p className="mt-1.5 text-sm text-[#abd1c6]/85 leading-relaxed">
              Реальные истории людей, которым помогла платформа Копилка
            </p>
          </div>
          <span
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-[#abd1c6] transition-all duration-300 group-hover:border-[#f9bc60]/30 group-hover:bg-[#f9bc60]/15 group-hover:text-[#f9bc60]"
            aria-hidden
          >
            <LucideIcons.ArrowRight size="md" />
          </span>
        </div>
      </Link>
    </section>
  );
}
