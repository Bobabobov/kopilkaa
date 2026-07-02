import Link from 'next/link';
import { AlertTriangle, ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from './good-deeds-ui/glassStyles';
import { SectionFeedbackCta } from '@/components/feedback/SectionFeedbackCta';

type Props = {
  isAuthenticated: boolean;
  cycleLabel?: string;
};

export function GoodDeedsHero({
  isAuthenticated,
  cycleLabel,
}: Props) {
  return (
    <header
      className="relative z-10"
      role="banner"
      aria-label="Заголовок раздела добрых дел"
    >
      <div className={cn(goodDeedsGlassPanel, 'px-4 py-5 sm:px-6 sm:py-6')}>
        <div className={goodDeedsGlassShine} />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10"
              aria-hidden
            >
              <HeartHandshake className="h-6 w-6 text-[#f9bc60]" />
            </div>

            <div className="min-w-0 flex-1 space-y-1.5">
              <h1 className="text-xl font-black tracking-tight text-[#fffffe] sm:text-2xl">
                Добрые дела
              </h1>
              {cycleLabel ? (
                <p className="max-w-xl text-sm text-[#abd1c6]/85">
                  {cycleLabel}
                </p>
              ) : null}
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-wrap items-center gap-2 lg:justify-end">
              <Button
                asChild
                size="sm"
                className="h-10 rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
              >
                <Link href="/login">
                  Войти
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-10 rounded-xl border-white/15 text-[#abd1c6]"
              >
                <Link href="/register">Регистрация</Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div className="relative mt-4 space-y-3">
          <p className="flex items-start gap-2 rounded-lg border border-amber-400/25 bg-amber-500/6 px-3 py-2 text-xs text-amber-100/90">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
            Тестовый режим — условия заданий могут меняться.
          </p>
          <SectionFeedbackCta variant="good-deeds" />
        </div>
      </div>
    </header>
  );
}
