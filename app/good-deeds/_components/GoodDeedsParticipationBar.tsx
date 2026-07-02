"use client";

import Link from "next/link";
import { Gift, LogIn, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GoodDeedTaskView } from "../types";
import { canSubmitGoodDeedTask } from "./goodDeedsTaskUi";
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from "./good-deeds-ui/glassStyles";

type Props = {
  isAuthenticated: boolean;
  tasks: GoodDeedTaskView[];
  submissionsClosed?: boolean;
  onOpenSubmit: (taskId?: string) => void;
  className?: string;
  variant?: "inline" | "sticky";
};

export function GoodDeedsParticipationBar({
  isAuthenticated,
  tasks,
  submissionsClosed = false,
  onOpenSubmit,
  className,
  variant = "inline",
}: Props) {
  const hasSubmittable = tasks.some((t) =>
    canSubmitGoodDeedTask(t.submissionStatus),
  );

  return (
    <section
      id="good-deeds-participate"
      aria-label="Участие в добрых делах"
      className={cn(
        variant === "sticky" &&
          "fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.1] bg-[#001e1d]/90 px-4 py-3 backdrop-blur-xl sm:hidden",
        className,
      )}
    >
      <div
        className={cn(
          variant === "inline" && goodDeedsGlassPanel,
          variant === "inline" && "px-4 py-4 sm:px-5 sm:py-5",
          variant === "sticky" && "mx-auto max-w-6xl",
        )}
      >
        {variant === "inline" ? <div className={goodDeedsGlassShine} /> : null}

        <div
          className={cn(
            "relative flex flex-col gap-4",
            variant === "inline" &&
              "sm:flex-row sm:items-center sm:justify-between",
          )}
        >
          {variant === "inline" ? (
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-[#f9bc60]" />
                <p className="text-sm font-bold text-[#fffffe] sm:text-base">
                  Добрые дела с наградой
                </p>
              </div>
              <p className="max-w-2xl text-xs leading-relaxed text-[#abd1c6]/90 sm:text-sm">
                Здесь можно взять задание — лёгкое, среднее или посложнее —
                сделать его в обычной жизни и прислать отчёт с фото и
                рассказом. Модератор проверит отчёт и подтвердит результат.
              </p>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 sm:shrink-0 sm:items-end">
            {isAuthenticated ? (
              <Button
                type="button"
                disabled={submissionsClosed || !hasSubmittable}
                onClick={() => onOpenSubmit()}
                className="h-11 w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a] sm:w-auto sm:min-w-[200px]"
              >
                <PlusCircle className="h-4 w-4" />
                {submissionsClosed ? "Приём закрыт" : "Сделать доброе дело"}
              </Button>
            ) : (
              <Button
                asChild
                className="h-11 w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a] sm:w-auto"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Войти
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
