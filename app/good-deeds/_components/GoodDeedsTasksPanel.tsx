"use client";

import { CalendarDays, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { GoodDeedsTaskCard } from "./GoodDeedsTaskCard";
import type { GoodDeedDifficulty, GoodDeedTaskView } from "../types";
import {
  goodDeedsGlassPanel,
  goodDeedsGlassShine,
} from "./good-deeds-ui/glassStyles";

const TIER: Record<GoodDeedDifficulty, { n: number; name: string }> = {
  EASY: { n: 1, name: "лёгкое" },
  MEDIUM: { n: 2, name: "среднее" },
  HARD: { n: 3, name: "сложное" },
};

type WeeklyProgress = {
  approved: number;
  pending: number;
  rejected: number;
  total: number;
};

type Props = {
  cycleLabel: string;
  weeklyProgress: WeeklyProgress;
  tasks: GoodDeedTaskView[];
  filesByTask: Record<string, File[]>;
  storyByTask: Record<string, string>;
  onStoryChange: (taskId: string, value: string) => void;
  onFilesChange: (taskId: string, files: FileList | null) => void;
  onSubmit: (taskId: string) => void;
  submittingTaskId: string | null;
  isAuthenticated: boolean;
  submissionsClosed?: boolean;
  submissionsClosedMessage?: string;
};

export function GoodDeedsTasksPanel({
  cycleLabel,
  weeklyProgress,
  tasks,
  filesByTask,
  storyByTask,
  onStoryChange,
  onFilesChange,
  onSubmit,
  submittingTaskId,
  isAuthenticated,
  submissionsClosed = false,
  submissionsClosedMessage,
}: Props) {
  const { approved, pending, rejected, total } = weeklyProgress;
  const progressPercent =
    total > 0 ? Math.min(100, Math.round((approved / total) * 100)) : 0;

  return (
    <section
      id="good-deeds-week-tasks"
      aria-label="Текущие задания"
      className="scroll-mt-24"
    >
      <div className={cn(goodDeedsGlassPanel, "px-4 py-5 sm:px-6 sm:py-7")}>
        <div className={goodDeedsGlassShine} />

        <div className="relative mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]">
                <ClipboardList className="h-5 w-5" />
              </span>
              <h2 className="text-xl font-black text-[#fffffe] sm:text-2xl">
                Текущие задания
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-[#abd1c6]/85">
              Три уровня сложности. Выполните в жизни, приложите рассказ и
              медиа — после проверки отчёт будет подтверждён.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-[#abd1c6]">
            <CalendarDays className="h-4 w-4 text-[#f9bc60]" />
            <span className="font-medium text-[#fffffe]">{cycleLabel}</span>
          </div>
        </div>

        {submissionsClosed ? (
          <div className="relative mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm leading-relaxed text-amber-100">
            {submissionsClosedMessage ?? "Подача добрых дел временно закрыта."}
          </div>
        ) : null}

        {total > 0 ? (
          <div className="relative mb-6 space-y-4 rounded-xl border border-white/[0.08] bg-black/20 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[#fffffe]">
                Ваш прогресс
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="default" className="tabular-nums">
                  {approved}/{total} одобрено
                </Badge>
                {pending > 0 ? (
                  <Badge variant="outline" className="tabular-nums">
                    на проверке {pending}
                  </Badge>
                ) : null}
                {rejected > 0 ? (
                  <Badge variant="muted" className="tabular-nums">
                    отклонено {rejected}
                  </Badge>
                ) : null}
              </div>
            </div>

            <div className="flex gap-2">
              {tasks.map((task) => {
                const tier = TIER[task.difficulty];
                const done = task.submissionStatus === "APPROVED";
                const waiting = task.submissionStatus === "PENDING";
                return (
                  <div key={task.id} className="flex flex-1 flex-col items-center gap-1.5">
                    <div
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums transition-all",
                        done
                          ? "border-emerald-400/60 bg-emerald-500/20 text-emerald-200"
                          : waiting
                            ? "border-amber-400/60 bg-amber-500/15 text-amber-200"
                            : "border-white/15 bg-white/[0.04] text-[#abd1c6]",
                      )}
                    >
                      {tier.n}
                    </div>
                    <span className="hidden text-[10px] font-medium capitalize text-[#94a1b2] sm:block">
                      {tier.name}
                    </span>
                  </div>
                );
              })}
            </div>

            <Progress
              value={progressPercent}
              aria-label={`Прогресс: ${approved} из ${total} заданий одобрено`}
            />
          </div>
        ) : (
          <p className="relative mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Сейчас нет активных заданий — загляните позже или напишите в
            поддержку.
          </p>
        )}

        {tasks.length > 0 ? (
          <div className="relative grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
            {tasks.map((task, index) => {
              const tier = TIER[task.difficulty];
              return (
                <div
                  key={task.id}
                  data-good-deed-task-slot={index}
                  className="flex min-h-0 w-full"
                >
                  <GoodDeedsTaskCard
                    index={index}
                    slotNumber={tier.n}
                    slotName={tier.name}
                    task={task}
                    variant="compact"
                    storyText={storyByTask[task.id] ?? ""}
                    onStoryTextChange={(value) => onStoryChange(task.id, value)}
                    selectedFiles={filesByTask[task.id] ?? []}
                    onFilesChange={(list) => onFilesChange(task.id, list)}
                    onSubmit={() => onSubmit(task.id)}
                    onReroll={() => {}}
                    isSubmitting={submittingTaskId === task.id}
                    isRerolling={false}
                    canReroll={false}
                    isAuthenticated={isAuthenticated}
                    submissionsClosed={submissionsClosed}
                  />
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
