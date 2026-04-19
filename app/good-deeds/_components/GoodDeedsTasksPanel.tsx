"use client";

import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { GoodDeedsTaskCard } from "./GoodDeedsTaskCard";
import type { GoodDeedsResponse } from "../types";

type Task = GoodDeedsResponse["tasks"][number];

type Props = {
  tasks: Task[];
  filesByTask: Record<string, File[]>;
  storyByTask: Record<string, string>;
  onStoryChange: (taskId: string, value: string) => void;
  onFilesChange: (taskId: string, files: FileList | null) => void;
  onSubmit: (taskId: string) => void;
  onReroll: (taskId: string) => void;
  submittingTaskId: string | null;
  rerollingTaskId: string | null;
  isAuthenticated: boolean;
  rerollUsed: boolean;
};

export function GoodDeedsTasksPanel({
  tasks,
  filesByTask,
  storyByTask,
  onStoryChange,
  onFilesChange,
  onSubmit,
  onReroll,
  submittingTaskId,
  rerollingTaskId,
  isAuthenticated,
  rerollUsed,
}: Props) {
  return (
    <section
      id="good-deeds-week-tasks"
      aria-label="Недельные задания"
      className="space-y-5"
    >
      <Card
        variant="darkGlass"
        padding="sm"
        className="border-[#f9bc60]/20 bg-gradient-to-br from-[#004643]/50 to-[#001e1d]/60 shadow-[0_0_0_1px_rgba(249,188,96,0.08)]"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f9bc60]/20 text-[#f9bc60]">
            <ClipboardList className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-[#fffffe] sm:text-xl">
              Задания недели
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#abd1c6]/90 sm:text-sm">
              Три разных задания: напишите рассказ (не короче 100 символов),
              прикрепите фото или видео и отправьте на проверку. Бонусы после
              одобрения —{" "}
              <span className="font-semibold text-[#f9bc60]/95">
                1 бонус = 1 ₽
              </span>
              . Заменить одно задание на другое из пула можно{" "}
              <span className="text-[#fffffe]">1 раз в неделю</span>.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tasks.map((task, index) => {
          const status = task.submissionStatus;
          const canReroll = isAuthenticated && !rerollUsed && status === null;

          return (
            <div
              key={task.id}
              data-good-deed-task-slot={index}
              className="rounded-2xl transition-[box-shadow,outline-color] duration-500"
            >
              <GoodDeedsTaskCard
                index={index}
                task={task}
                variant="compact"
                storyText={storyByTask[task.id] ?? ""}
                onStoryTextChange={(value) => onStoryChange(task.id, value)}
                selectedFiles={filesByTask[task.id] ?? []}
                onFilesChange={(list) => onFilesChange(task.id, list)}
                onSubmit={() => onSubmit(task.id)}
                onReroll={() => onReroll(task.id)}
                isSubmitting={submittingTaskId === task.id}
                isRerolling={rerollingTaskId === task.id}
                canReroll={canReroll}
                isAuthenticated={isAuthenticated}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
