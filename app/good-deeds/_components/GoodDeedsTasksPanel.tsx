"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GoodDeedsDifficultyModal } from "./GoodDeedsDifficultyModal";
import { GoodDeedsTaskCard } from "./GoodDeedsTaskCard";
import type {
  GoodDeedDifficulty,
  GoodDeedsResponse,
  GoodDeedTaskView,
} from "../types";

type Props = {
  mode: "difficulty-select" | "tasks";
  onStartTasks: () => void;
  selectedDifficulty: GoodDeedDifficulty;
  onDifficultyChange: (difficulty: GoodDeedDifficulty) => void;
  difficultyLocked: boolean;
  categoryStats: GoodDeedsResponse["categoryStats"];
  selectedCategoryProgress: GoodDeedsResponse["selectedCategoryProgress"];
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
  mode,
  onStartTasks,
  selectedDifficulty,
  onDifficultyChange,
  difficultyLocked,
  categoryStats,
  selectedCategoryProgress,
  tasks,
  filesByTask,
  storyByTask,
  onStoryChange,
  onFilesChange,
  onSubmit,
  submittingTaskId,
  isAuthenticated,
}: Props) {
  const [difficultyModalOpen, setDifficultyModalOpen] = useState(false);
  const [difficultyModalStartStep, setDifficultyModalStartStep] = useState(0);
  const selectedStat = categoryStats[selectedDifficulty];
  const selectedDifficultyTitle =
    selectedDifficulty === "EASY"
      ? "Легкий"
      : selectedDifficulty === "MEDIUM"
        ? "Средний"
        : "Тяжелый";
  const { approved, pending, total } = selectedCategoryProgress;

  const handleApplyDifficulty = (d: GoodDeedDifficulty) => {
    onDifficultyChange(d);
    if (mode === "difficulty-select") {
      onStartTasks();
    }
  };

  return (
    <section
      id="good-deeds-week-tasks"
      aria-label="Задания недели"
      className="space-y-5"
    >
      <GoodDeedsDifficultyModal
        open={difficultyModalOpen}
        onClose={() => setDifficultyModalOpen(false)}
        initialStep={difficultyModalStartStep}
        categoryStats={categoryStats}
        selectedDifficulty={selectedDifficulty}
        difficultyLocked={difficultyLocked}
        onApply={handleApplyDifficulty}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-xl font-semibold text-[#fffffe] sm:text-2xl">
            Задания недели
          </h2>
          <div className="mt-2 inline-flex items-center rounded-full border border-[#f9bc60]/35 bg-[#f9bc60]/10 px-3 py-1 text-xs font-semibold text-[#ffd89a] sm:text-sm">
            Ваш уровень: {selectedDifficultyTitle}
          </div>
          {mode === "tasks" ? (
            <p className="mt-1 text-sm text-[#abd1c6]">
              {selectedStat.label} · {approved}/{total}
              {pending > 0 ? ` · на проверке ${pending}` : null}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {mode === "difficulty-select" && !difficultyLocked ? (
            <Button
              type="button"
              onClick={() => {
                setDifficultyModalStartStep(0);
                setDifficultyModalOpen(true);
              }}
              className="rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
            >
              Выбрать сложность
            </Button>
          ) : null}
          {mode === "tasks" && !difficultyLocked ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDifficultyModalStartStep(2);
                setDifficultyModalOpen(true);
              }}
              className="rounded-xl border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
            >
              Сменить сложность
            </Button>
          ) : null}
        </div>
      </div>

      {mode === "tasks" && (
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tasks.map((task, index) => (
            <div key={task.id} data-good-deed-task-slot={index}>
              <GoodDeedsTaskCard
                index={index}
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
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
