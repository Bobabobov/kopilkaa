"use client";

import Link from "next/link";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { cn } from "@/lib/utils";
import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

interface StoryActionsProps {
  isAd?: boolean;
  advertiserLink?: string;
}

export default function StoryActions({
  isAd = false,
  advertiserLink,
}: StoryActionsProps) {
  return (
    <section
      className={cn(storiesGlassCard, "mt-2 p-6 sm:p-8")}
      aria-label="Действия"
    >
      <div className={storiesGlassShine} />
      <div className="relative text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80 mb-2">
          {isAd ? "Реклама" : "Вдохновились?"}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-[#fffffe] mb-2">
          {isAd
            ? "Узнайте больше о рекламе на Копилке"
            : "Расскажите свою историю"}
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm text-[#abd1c6]/85 leading-relaxed">
          {isAd
            ? "Разместите рекламную историю там, где люди читают реальные истории поддержки."
            : "Подайте заявку на финансовую помощь — мы рассмотрим её и поможем, если сможем."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {isAd && advertiserLink ? (
            <>
              <a
                href={advertiserLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-7 py-3.5 text-[#001e1d] font-bold shadow-[0_8px_24px_rgba(249,188,96,0.3)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(249,188,96,0.35)] hover:-translate-y-0.5"
              >
                <LucideIcons.ExternalLink size="md" />
                Перейти на сайт
              </a>
              <Link
                href="/advertising"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-7 py-3.5 text-[#abd1c6] font-semibold transition-all duration-300 hover:border-[#f9bc60]/40 hover:text-[#f9bc60] hover:bg-[#f9bc60]/10"
              >
                <LucideIcons.Megaphone size="md" />
                Разместить рекламу
              </Link>
            </>
          ) : (
            <Link
              href="/applications"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-8 py-3.5 text-[#001e1d] font-bold shadow-[0_8px_24px_rgba(249,188,96,0.3)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(249,188,96,0.35)] hover:-translate-y-0.5"
            >
              <LucideIcons.Plus size="md" />
              Подать заявку
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
