'use client';

import { ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { GoodDeedsTaskCard } from './GoodDeedsTaskCard';
import type { GoodDeedDifficulty, GoodDeedTaskView } from '../types';

const TIER: Record<GoodDeedDifficulty, { n: number; name: string }> = {
  EASY: { n: 1, name: 'лёгкое' },
  MEDIUM: { n: 2, name: 'среднее' },
  HARD: { n: 3, name: 'сложное' },
};

type WeeklyProgress = {
  approved: number;
  pending: number;
  rejected: number;
  total: number;
};

type Props = {
  weekLabel: string;
  weeklyProgress: WeeklyProgress;
  tasks: GoodDeedTaskView[];
  filesByTask: Record<string, File[]>;
  storyByTask: Record<string, string>;
  onStoryChange: (taskId: string, value: string) => void;
  onFilesChange: (taskId: string, files: FileList | null) => void;
  onSubmit: (taskId: string) => void;
  submittingTaskId: string | null;
  isAuthenticated: boolean;
};

export function GoodDeedsTasksPanel({
  weekLabel,
  weeklyProgress,
  tasks,
  filesByTask,
  storyByTask,
  onStoryChange,
  onFilesChange,
  onSubmit,
  submittingTaskId,
  isAuthenticated,
}: Props) {
  const { approved, pending, rejected, total } = weeklyProgress;
  const progressPercent =
    total > 0 ? Math.min(100, Math.round((approved / total) * 100)) : 0;

  return (
    <section
      id="good-deeds-week-tasks"
      aria-label="Задания недели"
      className="scroll-mt-6"
    >
      <Card
        variant="darkGlass"
        padding="lg"
        className="border-[#f9bc60]/18 shadow-[0_8px_40px_rgba(0,0,0,0.28)]"
      >
        <CardHeader className="mb-0 flex flex-col items-stretch gap-1 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <CardTitle
              icon={<ClipboardList className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />}
              className="[&_h3]:text-xl [&_h3]:sm:text-2xl"
            >
              Задания недели
            </CardTitle>
            <p className="max-w-3xl text-sm leading-relaxed text-[#abd1c6] sm:text-[15px]">
              Три уровня:{' '}
              <span className="font-medium text-[#e8f4ef]/95">1 — лёгкое</span>,{' '}
              <span className="font-medium text-[#e8f4ef]/95">2 — среднее</span>,{' '}
              <span className="font-medium text-[#e8f4ef]/95">3 — сложное</span>.
              Набор обновляется раз в неделю:{' '}
              <span className="whitespace-nowrap text-[#f9bc60]/95">
                {weekLabel}
              </span>
              .
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {total > 0 ? (
            <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-black/15 px-4 py-4 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-2 gap-y-1">
                <span className="text-sm font-medium text-[#fffffe]">
                  Прогресс недели
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default" className="tabular-nums">
                    {approved}/{total} сдано
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
              <Progress
                value={progressPercent}
                aria-label={`Прогресс: ${approved} из ${total} заданий сдано`}
              />
              <p className="text-xs leading-relaxed text-[#94a1b2]">
                Учитываются только одобренные отчёты.
              </p>
            </div>
          ) : (
            <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
              Сейчас нет активных заданий — загляните позже или напишите в
              поддержку.
            </p>
          )}

          {tasks.length > 0 ? (
            <>
              <Separator className="bg-white/[0.08]" />
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3">
                {tasks.map((task, index) => {
                  const tier = TIER[task.difficulty];
                  return (
                    <div key={task.id} data-good-deed-task-slot={index}>
                      <GoodDeedsTaskCard
                        index={index}
                        slotNumber={tier.n}
                        slotName={tier.name}
                        task={task}
                        variant="compact"
                        storyText={storyByTask[task.id] ?? ''}
                        onStoryTextChange={(value) =>
                          onStoryChange(task.id, value)
                        }
                        selectedFiles={filesByTask[task.id] ?? []}
                        onFilesChange={(list) => onFilesChange(task.id, list)}
                        onSubmit={() => onSubmit(task.id)}
                        onReroll={() => {}}
                        isSubmitting={submittingTaskId === task.id}
                        isRerolling={false}
                        canReroll={false}
                        isAuthenticated={isAuthenticated}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
