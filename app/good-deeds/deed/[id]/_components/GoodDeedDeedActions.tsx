"use client";

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  storiesGlassCard,
  storiesGlassShine,
} from "@/app/stories/_components/stories-ui/glassStyles";

export function GoodDeedDeedActions() {
  return (
    <section
      className={cn(storiesGlassCard, "mt-2 p-6 sm:p-8")}
      aria-label="Призыв к действию"
    >
      <div className={storiesGlassShine} />
      <div className="relative text-center">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f9bc60]/80">
          Вдохновились?
        </p>
        <h2 className="mb-2 text-xl font-bold text-[#fffffe] sm:text-2xl">
          Сделайте своё доброе дело
        </h2>
        <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed text-[#abd1c6]/85">
          Выберите задание, выполните его в жизни и отправьте отчёт — после
          проверки дело появится в вашем профиле и ленте.
        </p>
        <Link
          href="/good-deeds"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e8a545] px-8 py-3.5 font-bold text-[#001e1d] shadow-[0_8px_24px_rgba(249,188,96,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(249,188,96,0.35)] sm:w-auto"
        >
          <HeartHandshake className="h-5 w-5" />
          К добрым делам
        </Link>
      </div>
    </section>
  );
}
