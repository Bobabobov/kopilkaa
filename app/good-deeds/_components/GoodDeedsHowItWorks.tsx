import { Camera, CheckCircle2, Gift, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from "./good-deeds-ui/glassStyles";

const STEPS = [
  {
    icon: HeartHandshake,
    title: "Выберите задание",
    text: "Три уровня сложности — от простого к сложному",
  },
  {
    icon: Camera,
    title: "Сделайте и снимите",
    text: "Выполните в жизни и приложите фото и видео с рассказом",
  },
  {
    icon: CheckCircle2,
    title: "Дождитесь проверки",
    text: "Модератор подтвердит отчёт — бонусы придут на баланс",
  },
  {
    icon: Gift,
    title: "Получите бонусы",
    text: "1 бонус = 1 ₽. Можно вывести на карту после накопления",
  },
] as const;

export function GoodDeedsHowItWorks() {
  return (
    <section aria-label="Как это работает">
      <div className={cn(goodDeedsGlassPanel, "px-4 py-5 sm:px-6 sm:py-6")}>
        <div className={goodDeedsGlassShine} />
        <p className="relative text-[10px] font-bold uppercase tracking-[0.2em] text-[#abd1c6]/80">
          Как это работает
        </p>
        <div className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#f9bc60]/80 tabular-nums">
                    {index + 1}
                  </p>
                  <p className="text-sm font-semibold text-[#fffffe] leading-tight">
                    {step.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]/80">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
