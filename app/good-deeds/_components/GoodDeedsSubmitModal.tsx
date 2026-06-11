"use client";

import { useEffect, useState } from "react";
import { GlassModal, GlassModalCloseButton } from "@/components/ui/GlassModal";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DEFAULT_GOOD_DEED_STORY_PLACEHOLDER,
  GOOD_DEED_MEDIA_REQUIREMENT_NOTICE,
  GOOD_DEED_PHOTO_FILE_HINT,
  GOOD_DEED_STORY_EXTRA_HELP,
  GOOD_DEED_VIDEO_FILE_HINTS,
  hasGoodDeedPhotoAndVideoFiles,
  MAX_GOOD_DEED_STORY_CHARS,
  MIN_GOOD_DEED_STORY_CHARS,
} from "@/lib/goodDeeds";
import type { GoodDeedDifficulty, GoodDeedTaskView } from "../types";
import {
  bonusWord,
  canSubmitGoodDeedTask,
  displayTierLabel,
  getTaskStatusMeta,
  TASK_TIER,
} from "./goodDeedsTaskUi";
import {
  getUploadSizeLimitLabel,
  UPLOAD_PHOTO_ACCEPT,
  UPLOAD_VIDEO_ACCEPT,
  validateGoodDeedMediaFile,
} from "@/lib/uploads/limits";

type Step = "pick" | "form";

const TIER_ACCENT: Record<GoodDeedDifficulty, string> = {
  EASY: "from-emerald-400/80 via-emerald-500/20 to-transparent",
  MEDIUM: "from-[#f9bc60]/90 via-[#f9bc60]/25 to-transparent",
  HARD: "from-rose-400/80 via-rose-500/20 to-transparent",
};

type Props = {
  open: boolean;
  onClose: () => void;
  tasks: GoodDeedTaskView[];
  initialTaskId?: string | null;
  storyByTask: Record<string, string>;
  filesByTask: Record<string, File[]>;
  onStoryChange: (taskId: string, value: string) => void;
  onMediaFileChange: (
    taskId: string,
    kind: "photo" | "video",
    files: FileList | null,
  ) => void;
  onMediaValidationError?: (message: string) => void;
  onSubmit: (taskId: string) => void;
  submittingTaskId: string | null;
  submissionsClosed?: boolean;
  submissionsClosedMessage?: string;
};

export function GoodDeedsSubmitModal({
  open,
  onClose,
  tasks,
  initialTaskId,
  storyByTask,
  filesByTask,
  onStoryChange,
  onMediaFileChange,
  onMediaValidationError,
  onSubmit,
  submittingTaskId,
  submissionsClosed = false,
  submissionsClosedMessage,
}: Props) {
  const [step, setStep] = useState<Step>("pick");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  useEffect(() => {
    if (!open) return;
    setStep(initialTaskId ? "form" : "pick");
    setSelectedTaskId(initialTaskId ?? null);
  }, [open, initialTaskId]);

  const pickTask = (task: GoodDeedTaskView) => {
    if (!canSubmitGoodDeedTask(task.submissionStatus)) return;
    if (submissionsClosed) return;
    setSelectedTaskId(task.id);
    setStep("form");
  };

  const handleSubmit = () => {
    if (!selectedTaskId) return;
    onSubmit(selectedTaskId);
  };

  const storyText = selectedTaskId ? (storyByTask[selectedTaskId] ?? "") : "";
  const selectedFiles = selectedTaskId ? (filesByTask[selectedTaskId] ?? []) : [];
  const storyHelp = selectedTask ? GOOD_DEED_STORY_EXTRA_HELP[selectedTask.id] : undefined;
  const storyPlaceholder =
    storyHelp?.placeholder ?? DEFAULT_GOOD_DEED_STORY_PLACEHOLDER;
  const isSubmitting = submittingTaskId === selectedTaskId;
  const hasPhotoAndVideo = hasGoodDeedPhotoAndVideoFiles(selectedFiles);
  const photoFiles = selectedFiles.filter((file) =>
    file.type.startsWith("image/"),
  );
  const videoFiles = selectedFiles.filter((file) =>
    file.type.startsWith("video/"),
  );

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      hideHeader
      showCloseButton={false}
      size="2xl"
      align="end"
      zIndex={9400}
      maxHeight="min(92dvh, 820px)"
      bodyClassName="p-0"
      ariaLabelledBy="good-deeds-submit-title"
      header={
        <div className="relative flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f9bc60]/25 bg-[#f9bc60]/10 text-[#f9bc60]">
                <HeartHandshake className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#abd1c6]/75">
                  {step === "pick" ? "Шаг 1 из 2" : "Шаг 2 из 2"}
                </p>
                <h2
                  id="good-deeds-submit-title"
                  className="text-lg font-black text-[#fffffe] sm:text-xl"
                >
                  {step === "pick"
                    ? "Сделать доброе дело"
                    : selectedTask?.title ?? "Ваш отчёт"}
                </h2>
              </div>
            </div>
          </div>
          <GlassModalCloseButton onClose={onClose} />
        </div>
      }
      footer={
        step === "form" && selectedTask && !submissionsClosed ? (
          <Button
            type="button"
            disabled={
              isSubmitting ||
              !hasPhotoAndVideo ||
              storyText.trim().length < MIN_GOOD_DEED_STORY_CHARS
            }
            onClick={handleSubmit}
            className="h-11 w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]"
          >
            {isSubmitting ? (
              "Отправка…"
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Отправить на проверку
              </>
            )}
          </Button>
        ) : undefined
      }
    >
      <div
        className="px-5 py-4 sm:px-6 sm:py-5"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
              {submissionsClosed ? (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  {submissionsClosedMessage ??
                    "Подача добрых дел временно закрыта."}
                </p>
              ) : step === "pick" ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-[#abd1c6]/95">
                      Сейчас доступны три задания — от простого к сложному.
                      Выберите то, что готовы сделать: убрать мусор, оставить
                      отзыв, сдать кровь — что угодно из списка. Сначала
                      выполните его в жизни, потом вернитесь сюда с фото и
                      рассказом.
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-[#94a1b2]">
                      Проверим отчёт и начислим бонусы — их можно вывести
                      рублями (1 бонус = 1 ₽).
                    </p>
                  </div>

                  <div className="space-y-3">
                    {tasks.map((task, index) => {
                      const tier = TASK_TIER[task.difficulty];
                      const statusMeta = getTaskStatusMeta(task.submissionStatus);
                      const selectable = canSubmitGoodDeedTask(
                        task.submissionStatus,
                      );

                      return (
                        <button
                          key={task.id}
                          type="button"
                          data-good-deed-task-slot={index}
                          disabled={!selectable || submissionsClosed}
                          onClick={() => pickTask(task)}
                          className={cn(
                            "group relative w-full overflow-hidden rounded-2xl border text-left transition",
                            selectable && !submissionsClosed
                              ? "border-white/[0.12] bg-white/[0.04] hover:border-[#f9bc60]/35 hover:bg-[#f9bc60]/6"
                              : "cursor-default border-white/[0.06] bg-black/25 opacity-75",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute inset-y-0 left-0 w-1 bg-gradient-to-b",
                              TIER_ACCENT[task.difficulty],
                            )}
                            aria-hidden
                          />

                          <div className="p-4 pl-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f9bc60] text-xs font-bold text-[#001e1d]">
                                  {tier.n}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="border-[#f9bc60]/25 capitalize text-[#ffe8c2]"
                                >
                                  {displayTierLabel(tier.name)}
                                </Badge>
                                {statusMeta ? (
                                  <span
                                    className={cn(
                                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                                      statusMeta.className,
                                    )}
                                  >
                                    {statusMeta.label}
                                  </span>
                                ) : null}
                              </div>
                              <span className="shrink-0 rounded-full border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-2.5 py-1 text-xs font-bold text-[#f9bc60]">
                                +{task.reward} {bonusWord(task.reward)}
                              </span>
                            </div>

                            <p className="mt-3 text-base font-bold text-[#fffffe]">
                              {task.title}
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-[#abd1c6]/90">
                              {task.description}
                            </p>

                            {task.submissionStatus === "REJECTED" &&
                            task.adminComment ? (
                              <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-950/30 px-3 py-2 text-xs leading-relaxed text-rose-100">
                                {task.adminComment}
                              </p>
                            ) : null}

                            {selectable && !submissionsClosed ? (
                              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#f9bc60] transition group-hover:gap-2.5">
                                Перейти к отчёту
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : selectedTask ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setStep("pick")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#abd1c6] transition hover:text-[#f9bc60]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    К списку заданий
                  </button>

                  <div className="rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/6 px-4 py-3.5">
                    <p className="text-sm leading-relaxed text-[#e8f4ef]">
                      {selectedTask.description}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#f9bc60]">
                      За это задание — +{selectedTask.reward}{" "}
                      {bonusWord(selectedTask.reward)}
                    </p>
                  </div>

                  {selectedTask.submissionStatus === "REJECTED" &&
                  selectedTask.adminComment ? (
                    <p className="rounded-xl border border-rose-500/35 bg-rose-950/30 px-4 py-3 text-sm text-rose-100">
                      <span className="font-semibold">От модератора: </span>
                      {selectedTask.adminComment}
                    </p>
                  ) : null}

                  <div
                    className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3.5"
                    role="note"
                  >
                    <p className="flex items-start gap-2.5 text-sm leading-relaxed text-amber-50">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-300"
                        aria-hidden
                      />
                      <span>
                        <span className="font-semibold text-amber-100">
                          Важно для модерации.{" "}
                        </span>
                        {GOOD_DEED_MEDIA_REQUIREMENT_NOTICE}
                      </span>
                    </p>
                  </div>

                  <p className="text-sm text-[#abd1c6]/85">
                    Ниже — рассказ о том, как прошло, и загрузка файлов.
                  </p>

                  {storyHelp?.notice ? (
                    <p className="rounded-lg border border-amber-500/30 bg-amber-950/25 px-3 py-2.5 text-sm text-amber-100/95">
                      {storyHelp.notice}
                    </p>
                  ) : null}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Label
                        htmlFor="good-deed-modal-story"
                        className="text-[#abd1c6]"
                      >
                        Рассказ
                      </Label>
                      <span
                        className={cn(
                          "text-xs font-medium tabular-nums",
                          storyText.trim().length >= MIN_GOOD_DEED_STORY_CHARS
                            ? "text-emerald-300/90"
                            : "text-[#94a1b2]",
                        )}
                      >
                        {storyText.trim().length}/{MIN_GOOD_DEED_STORY_CHARS}
                      </span>
                    </div>
                    <textarea
                      id="good-deed-modal-story"
                      value={storyText}
                      maxLength={MAX_GOOD_DEED_STORY_CHARS}
                      rows={5}
                      placeholder={storyPlaceholder}
                      onChange={(e) =>
                        onStoryChange(selectedTask.id, e.target.value)
                      }
                      className="min-h-[120px] w-full resize-y rounded-xl border border-[#abd1c6]/25 bg-[#001e1d]/55 px-3 py-2.5 text-sm leading-relaxed text-[#fffffe] placeholder:text-[#5c6d7a] outline-none focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <GoodDeedMediaDropzone
                      id="good-deed-modal-photo"
                      label="Фото"
                      hint={
                        storyHelp?.fileUploadHint ?? GOOD_DEED_PHOTO_FILE_HINT
                      }
                      accept={UPLOAD_PHOTO_ACCEPT}
                      formatsLabel={`JPG, PNG, WebP, HEIC · ${getUploadSizeLimitLabel("photo")}`}
                      files={photoFiles}
                      onChange={(fileList) => {
                        const file = fileList?.[0];
                        if (!file) return;
                        const error = validateGoodDeedMediaFile(file, "photo");
                        if (error) {
                          onMediaValidationError?.(error);
                          return;
                        }
                        onMediaFileChange(selectedTask.id, "photo", fileList);
                      }}
                    />
                    <GoodDeedMediaDropzone
                      id="good-deed-modal-video"
                      label="Видео"
                      hints={GOOD_DEED_VIDEO_FILE_HINTS}
                      accept={UPLOAD_VIDEO_ACCEPT}
                      formatsLabel={`MP4, MOV, WebM · ${getUploadSizeLimitLabel("video")}`}
                      files={videoFiles}
                      onChange={(fileList) => {
                        const file = fileList?.[0];
                        if (!file) return;
                        const error = validateGoodDeedMediaFile(file, "video");
                        if (error) {
                          onMediaValidationError?.(error);
                          return;
                        }
                        onMediaFileChange(selectedTask.id, "video", fileList);
                      }}
                    />
                  </div>
                </div>
              ) : null}
      </div>
    </GlassModal>
  );
}

type MediaDropzoneProps = {
  id: string;
  label: string;
  hint?: string;
  hints?: readonly string[];
  accept: string;
  formatsLabel: string;
  files: File[];
  onChange: (files: FileList | null) => void;
};

function GoodDeedMediaDropzone({
  id,
  label,
  hint,
  hints,
  accept,
  formatsLabel,
  files,
  onChange,
}: MediaDropzoneProps) {
  const hasFile = files.length > 0;
  const hintLines = hints ?? (hint ? [hint] : []);

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#abd1c6]">
        {label}
      </Label>
      <div className="space-y-1">
        {hintLines.map((line) => (
          <p
            key={line}
            className="text-xs leading-relaxed text-amber-100/90"
          >
            {line}
          </p>
        ))}
      </div>
      <div
        className={cn(
          "rounded-xl border border-dashed px-4 py-6 text-center transition",
          hasFile
            ? "border-emerald-400/35 bg-emerald-950/20"
            : "border-[#abd1c6]/35 bg-[#001e1d]/40 hover:border-[#f9bc60]/30 hover:bg-[#001e1d]/55",
        )}
      >
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onChange(e.currentTarget.files)}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className="flex cursor-pointer flex-col items-center gap-2"
        >
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full",
              hasFile
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-[#f9bc60]/15 text-[#f9bc60]",
            )}
          >
            {hasFile ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <Upload className="h-5 w-5" />
            )}
          </span>
          <span className="text-sm font-medium text-[#fffffe]">
            {hasFile ? "Заменить файл" : "Выбрать файл"}
          </span>
          <span className="text-xs text-[#94a1b2]">{formatsLabel}</span>
        </label>
        {hasFile ? (
          <p className="mt-3 truncate px-1 text-xs font-medium text-emerald-300">
            {files[0]?.name}
          </p>
        ) : null}
      </div>
    </div>
  );
}
