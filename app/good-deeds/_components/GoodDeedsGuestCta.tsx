import Link from "next/link";
import { LogIn, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LEVEL_BENEFIT_HINT } from "@/lib/userLevel/economy";
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from "./good-deeds-ui/glassStyles";

export function GoodDeedsGuestCta() {
  return (
    <section id="good-deeds-participate" aria-label="Вход для участия" className="scroll-mt-24">
      <div
        className={cn(
          goodDeedsGlassPanel,
          "border-[#f9bc60]/20 bg-[linear-gradient(145deg,rgba(249,188,96,0.08)_0%,rgba(0,30,29,0.4)_100%)] px-5 py-6 sm:px-7 sm:py-8",
        )}
      >
        <div className={goodDeedsGlassShine} />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60]"
              aria-hidden
            >
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#fffffe] sm:text-xl">
                Участвуйте в добрых делах
              </h2>
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-[#abd1c6]/90">
                Войдите в аккаунт, чтобы выполнять задания, отправлять
                отчёты и прокачивать уровень профиля.
              </p>
              <p className="mt-1 max-w-lg text-xs leading-relaxed text-[#94a1b2]">
                {LEVEL_BENEFIT_HINT}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:shrink-0">
            <Button
              asChild
              className="h-11 rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
            >
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Войти
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-xl border-white/15 bg-white/[0.04] text-[#abd1c6] hover:border-[#f9bc60]/40 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            >
              <Link href="/register">
                <UserPlus className="h-4 w-4" />
                Регистрация
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
