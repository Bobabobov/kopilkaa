"use client";

import { useEffect, useState } from "react";
import { ChevronUp, RefreshCcw, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  MAX_GOOD_DEED_STORY_CHARS,
  MIN_GOOD_DEED_STORY_CHARS,
} from "@/lib/goodDeeds";
import type { GoodDeedsResponse } from "../types";

type Task = GoodDeedsResponse["tasks"][number];

function bonusWord(n: number): string {
  const m = n % 10;
  const c = n % 100;
  if (m === 1 && c !== 11) return "бонус";
  if (m >= 2 && m <= 4 && (c < 10 || c > 20)) return "бонуса";
  return "бонусов";
}

type Props = {
  index: number;
  task: Task;
  storyText: string;
  onStoryTextChange: (value: string) => void;
  selectedFiles: File[];
  onFilesChange: (files: FileList | null) => void;
  onSubmit: () => void;
  onReroll: () => void;
  isSubmitting: boolean;
  isRerolling: boolean;
  canReroll: boolean;
  isAuthenticated: boolean;
  /** Компактный вид для боковой панели */
  variant?: "default" | "compact";
};

export function GoodDeedsTaskCard({
  index,
  task,
  storyText,
  onStoryTextChange,
  selectedFiles,
  onFilesChange,
  onSubmit,
  onReroll,
  isSubmitting,
  isRerolling,
  canReroll,
  isAuthenticated,
  variant = "default",
}: Props) {
  const compact = variant === "compact";
  const status = task.submissionStatus;

  const [workspaceOpen, setWorkspaceOpen] = useState(status !== null);

  useEffect(() => {
    if (status !== null) {
      setWorkspaceOpen(true);
    }
  }, [status]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setWorkspaceOpen(true);
    }
  }, [selectedFiles.length]);

  useEffect(() => {
    if (storyText.trim().length > 0) {
      setWorkspaceOpen(true);
    }
  }, [storyText]);

  /** Пока задание не начато — короткая карточка; отчёт раскрывается по кнопке. */
  const showCollapsedPreview =
    status === null && !workspaceOpen && selectedFiles.length === 0;

  const statusMeta =
    status === "PENDING"
      ? {
          label: "На проверке",
          className: "border-amber-500/40 bg-amber-500/10 text-amber-200",
        }
      : status === "APPROVED"
        ? {
            label: "Подтверждено",
            className:
              "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
          }
        : status === "REJECTED"
          ? {
              label: "Отклонено",
              className: "border-rose-500/40 bg-rose-500/10 text-rose-100",
            }
          : null;

  return (
    <Card
      variant="darkGlass"
      padding={compact ? "sm" : "md"}
      className={cn(
        "overflow-hidden border-white/[0.08] transition duration-200 hover:border-[#f9bc60]/20 hover:shadow-lg hover:shadow-black/25",
        status === "APPROVED" && "ring-1 ring-emerald-500/25",
        compact && "shadow-md",
      )}
    >
      <CardHeader
        className={cn(
          "mb-0 flex flex-row items-start justify-start gap-3 pb-2",
          compact && "gap-2.5 pb-1.5",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e8a545] font-black text-[#001e1d] shadow-inner shadow-white/20",
            compact ? "h-9 w-9 text-sm" : "h-11 w-11 text-lg",
          )}
        >
          {index + 1}
        </div>
        <div
          className={cn("min-w-0 flex-1", compact ? "space-y-1" : "space-y-2")}
        >
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <h2
              className={cn(
                "font-bold leading-tight text-[#fffffe]",
                compact ? "text-base" : "text-lg sm:text-xl",
              )}
            >
              {task.title}
            </h2>
            <Badge variant="secondary" className="font-semibold">
              +{task.reward} {bonusWord(task.reward)}
            </Badge>
            {statusMeta && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                  statusMeta.className,
                )}
              >
                {statusMeta.label}
              </span>
            )}
            {canReroll && !showCollapsedPreview && (
              <Badge
                variant="outline"
                className="border-dashed border-[#abd1c6]/50"
              >
                Замена 1× / нед
              </Badge>
            )}
          </div>
          <p
            className={cn(
              "leading-relaxed text-[#abd1c6]/95",
              compact ? "line-clamp-2 text-xs" : "text-sm",
              showCollapsedPreview && "line-clamp-3",
            )}
          >
            {task.description}
          </p>
        </div>
      </CardHeader>

      {showCollapsedPreview ? (
        <CardFooter
          className={cn(
            "flex-col gap-2 pt-0",
            canReroll
              ? "sm:flex-row sm:flex-wrap sm:justify-end"
              : "sm:flex-row sm:justify-end",
          )}
        >
          {canReroll && (
            <Button
              type="button"
              variant="outline"
              onClick={onReroll}
              disabled={isRerolling}
              className={cn(
                "w-full rounded-xl border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-[#004643]/50 hover:text-[#fffffe]",
                compact ? "h-9 text-sm" : "h-10",
                "sm:min-w-[200px] sm:flex-1",
              )}
            >
              <RefreshCcw
                className={cn("h-4 w-4", isRerolling && "animate-spin")}
              />
              {isRerolling ? "Замена…" : "Заменить задание"}
            </Button>
          )}
          <Button
            type="button"
            onClick={() => setWorkspaceOpen(true)}
            className={cn(
              "w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]",
              compact ? "h-9 text-sm" : "h-10",
              canReroll && "sm:min-w-[200px] sm:flex-1",
            )}
          >
            Взять задание
          </Button>
        </CardFooter>
      ) : null}

      {!showCollapsedPreview && (
        <>
          <CardContent
            className={cn("pt-0", compact ? "space-y-3" : "space-y-4")}
          >
            {status === null && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={selectedFiles.length > 0}
                  onClick={() => setWorkspaceOpen(false)}
                  className="h-8 gap-1 text-xs text-[#94a1b2] hover:text-[#abd1c6]"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  Свернуть
                </Button>
              </div>
            )}

            {status === "REJECTED" && task.adminComment && (
          <div
            className={cn(
              "rounded-2xl border border-rose-500/35 bg-rose-950/30 text-rose-100/95",
              compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
            )}
          >
            <span className="font-semibold text-rose-200">
              Комментарий модератора:{" "}
            </span>
            {task.adminComment}
          </div>
        )}

        {status === "APPROVED" ? (
          <p
            className={cn(
              "rounded-2xl border border-emerald-500/25 bg-emerald-950/20 text-[#abd1c6]",
              compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm",
            )}
          >
            Задание принято — бонусы начислены. Спасибо за участие.
          </p>
        ) : (
          <>
            <Separator className="bg-[#abd1c6]/15" />
            <div className={cn(compact ? "space-y-2" : "space-y-3")}>
              <div className="flex items-center justify-between gap-2">
                <Label
                  htmlFor={`good-deed-story-${task.id}`}
                  className={cn("text-[#abd1c6]", compact && "text-xs")}
                >
                  Рассказ о выполнении
                </Label>
                <span
                  className={cn(
                    "tabular-nums text-xs font-medium",
                    storyText.trim().length >= MIN_GOOD_DEED_STORY_CHARS
                      ? "text-emerald-300/90"
                      : "text-[#94a1b2]",
                  )}
                >
                  {storyText.trim().length}/{MIN_GOOD_DEED_STORY_CHARS} мин.
                </span>
              </div>
              <textarea
                id={`good-deed-story-${task.id}`}
                value={storyText}
                maxLength={MAX_GOOD_DEED_STORY_CHARS}
                rows={compact ? 4 : 5}
                disabled={!isAuthenticated || status === "PENDING"}
                placeholder="Опишите, как вы выполнили задание — не короче 100 символов без пробелов по краям."
                onChange={(e) => onStoryTextChange(e.target.value)}
                className={cn(
                  "min-h-[96px] w-full resize-y rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/55 px-3 py-2.5 text-sm leading-relaxed text-[#fffffe] placeholder:text-[#5c6d7a]",
                  "outline-none transition focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15",
                  (!isAuthenticated || status === "PENDING") &&
                    "cursor-not-allowed opacity-50",
                )}
              />
            </div>
            <div className={cn(compact ? "space-y-2" : "space-y-3")}>
              <Label
                htmlFor={`good-deed-files-${task.id}`}
                className={cn("text-[#abd1c6]", compact && "text-xs")}
              >
                {compact
                  ? "Фото / видео (до 5)"
                  : "Фото или видео (до 5 файлов)"}
              </Label>
              <div
                className={cn(
                  "rounded-2xl border border-dashed border-[#abd1c6]/35 bg-[#001e1d]/40 text-center transition",
                  compact ? "px-3 py-4" : "px-4 py-6",
                  !isAuthenticated && "opacity-60",
                  status === "PENDING" && "pointer-events-none opacity-50",
                )}
              >
                <input
                  id={`good-deed-files-${task.id}`}
                  type="file"
                  multiple
                  accept="image/*,video/mp4,video/webm"
                  disabled={!isAuthenticated || status === "PENDING"}
                  onChange={(e) => onFilesChange(e.currentTarget.files)}
                  className="sr-only"
                />
                <label
                  htmlFor={`good-deed-files-${task.id}`}
                  className="flex cursor-pointer flex-col items-center gap-1.5 sm:gap-2"
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-full bg-[#f9bc60]/15 text-[#f9bc60]",
                      compact ? "h-8 w-8" : "h-10 w-10",
                    )}
                  >
                    <Upload className={compact ? "h-4 w-4" : "h-5 w-5"} />
                  </span>
                  <span
                    className={cn(
                      "font-medium text-[#fffffe]",
                      compact ? "text-xs" : "text-sm",
                    )}
                  >
                    {compact ? "Выбрать файлы" : "Нажмите или перетащите файлы"}
                  </span>
                  {!compact && (
                    <span className="text-xs text-[#94a1b2]">
                      JPG, PNG, WebP, GIF, MP4, WebM · до 5 МБ каждый (для видео
                      — по правилам загрузки)
                    </span>
                  )}
                </label>
                {selectedFiles.length > 0 && (
                  <p className="mt-3 text-xs font-medium text-[#f9bc60]">
                    Выбрано файлов: {selectedFiles.length}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
          </CardContent>

          {status !== "APPROVED" && (
            <CardFooter
              className={cn(
                "flex flex-col gap-2",
                !compact && "sm:flex-row sm:flex-wrap",
              )}
            >
              <Button
                onClick={onSubmit}
                disabled={
                  isSubmitting ||
                  status === "PENDING" ||
                  !isAuthenticated ||
                  selectedFiles.length < 1 ||
                  storyText.trim().length < MIN_GOOD_DEED_STORY_CHARS
                }
                className={cn(
                  "w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] hover:bg-[#f7b24a]",
                  compact ? "h-9 text-sm" : "h-11 sm:w-auto sm:min-w-[220px]",
                )}
              >
                <Upload className="h-4 w-4" />
                {status === "PENDING"
                  ? "Отправлено на проверку"
                  : compact
                    ? "На проверку"
                    : "Отправить на проверку"}
              </Button>
              {canReroll && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onReroll}
                  disabled={isRerolling}
                  className={cn(
                    "w-full rounded-xl border-[#abd1c6]/35 bg-transparent text-[#abd1c6] hover:bg-[#004643]/50 hover:text-[#fffffe]",
                    compact ? "h-9 text-sm" : "h-11 sm:w-auto sm:min-w-[220px]",
                  )}
                >
                  <RefreshCcw
                    className={cn("h-4 w-4", isRerolling && "animate-spin")}
                  />
                  {isRerolling ? "Замена…" : "Заменить задание"}
                </Button>
              )}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
}
