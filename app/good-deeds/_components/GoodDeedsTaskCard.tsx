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
  DEFAULT_GOOD_DEED_STORY_PLACEHOLDER,
  GOOD_DEED_STORY_EXTRA_HELP,
  MAX_GOOD_DEED_STORY_CHARS,
  MIN_GOOD_DEED_STORY_CHARS,
} from "@/lib/goodDeeds";
import type { GoodDeedTaskView } from "../types";

type Task = GoodDeedTaskView;

function bonusWord(n: number): string {
  const m = n % 10;
  const c = n % 100;
  if (m === 1 && c !== 11) return "бонус";
  if (m >= 2 && m <= 4 && (c < 10 || c > 20)) return "бонуса";
  return "бонусов";
}

function displayTierLabel(name: string): string {
  if (!name) return name;
  return name.charAt(0).toUpperCase() + name.slice(1);
}

type Props = {
  index: number;
  /** Номер слота недели (1–3), если отличается от порядка в списке */
  slotNumber?: number;
  /** Подпись уровня: «лёгкое», «среднее», «сложное» */
  slotName?: string;
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
  slotNumber,
  slotName,
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
  const badgeNumber = slotNumber ?? index + 1;
  const status = task.submissionStatus;
  const storyHelp = GOOD_DEED_STORY_EXTRA_HELP[task.id];
  const storyPlaceholder =
    storyHelp?.placeholder ?? DEFAULT_GOOD_DEED_STORY_PLACEHOLDER;

  const [workspaceOpen, setWorkspaceOpen] = useState(status !== null);

  useEffect(() => {
    if (status === "PENDING") {
      setWorkspaceOpen(false);
      return;
    }
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
  const showPendingPreview = status === "PENDING";
  const useTierColumnLayout = compact && Boolean(slotName);

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
          'mb-0 flex flex-row items-start justify-between gap-3 pb-2',
          compact && 'gap-3 pb-1.5',
        )}
      >
        <div
          className={cn(
            'min-w-0 flex-1 space-y-2',
            compact && 'space-y-1.5',
          )}
        >
          {slotName ? (
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  'border-0 bg-gradient-to-br from-[#f9bc60] to-[#e8a545] px-2.5 font-bold tabular-nums text-[#001e1d] shadow-sm ring-1 ring-white/15',
                  compact ? 'h-6 min-w-[1.5rem] justify-center text-[11px]' : 'text-xs',
                )}
              >
                {badgeNumber}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  'border-[#f9bc60]/40 bg-[#f9bc60]/12 font-semibold capitalize text-[#ffe8c2] shadow-sm backdrop-blur-[2px]',
                  compact ? 'h-6 px-2.5 text-[11px]' : 'text-xs',
                )}
              >
                {displayTierLabel(slotName)}
              </Badge>
            </div>
          ) : (
            <Badge
              variant="secondary"
              className={cn(
                'font-bold tabular-nums',
                compact ? 'text-xs' : 'text-sm',
              )}
            >
              {badgeNumber}
            </Badge>
          )}
          <div
            className={cn(
              'flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2',
              useTierColumnLayout && 'block',
            )}
          >
            <h2
              className={cn(
                'min-w-0 font-bold leading-tight text-[#fffffe]',
                compact ? 'text-base' : 'text-lg sm:text-xl',
              )}
            >
              {task.title}
            </h2>
            {!useTierColumnLayout ? (
              <>
                <Badge variant="secondary" className="font-semibold">
                  +{task.reward} {bonusWord(task.reward)}
                </Badge>
                {statusMeta && (
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
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
              </>
            ) : null}
          </div>
          {!showCollapsedPreview && (
            <p
              className={cn(
                "leading-relaxed text-[#abd1c6]/95",
                compact ? "text-xs sm:text-[13px]" : "text-sm sm:text-[15px]",
                !showPendingPreview && "text-[#e8f4ef]/95",
              )}
            >
              {task.description}
            </p>
          )}
        </div>
        {useTierColumnLayout ? (
          <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5 text-right">
            <Badge variant="secondary" className="font-semibold whitespace-nowrap">
              +{task.reward} {bonusWord(task.reward)}
            </Badge>
            {statusMeta ? (
              <span
                className={cn(
                  'inline-flex max-w-[9rem] items-center justify-end rounded-full border px-2 py-0.5 text-[11px] font-semibold leading-tight',
                  statusMeta.className,
                )}
              >
                {statusMeta.label}
              </span>
            ) : null}
            {canReroll && !showCollapsedPreview ? (
              <Badge
                variant="outline"
                className="border-dashed border-[#abd1c6]/50 text-[10px]"
              >
                Замена 1× / нед
              </Badge>
            ) : null}
          </div>
        ) : null}
      </CardHeader>

      {showCollapsedPreview || showPendingPreview ? (
        <CardFooter
          className={cn(
            "flex-col gap-2 pt-0",
            canReroll && !showPendingPreview
              ? "sm:flex-row sm:flex-wrap sm:justify-end"
              : "sm:flex-row sm:justify-end",
          )}
        >
          {showPendingPreview && (
            <p
              className={cn(
                "w-full rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-100",
                compact ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm",
              )}
            >
              На проверке.
            </p>
          )}
          {canReroll && !showPendingPreview && (
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
          {!showPendingPreview && (
            <Button
              type="button"
              onClick={() => setWorkspaceOpen(true)}
              className={cn(
                'w-full rounded-xl bg-[#f9bc60] font-semibold text-[#001e1d] shadow-sm shadow-black/20 hover:bg-[#f7b24a]',
                compact ? 'h-10 text-sm sm:h-11' : 'h-10',
                canReroll && 'sm:min-w-[200px] sm:flex-1',
              )}
            >
              Открыть
            </Button>
          )}
        </CardFooter>
      ) : null}

      {!showCollapsedPreview && !showPendingPreview && (
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
                Принято, бонусы начислены.
              </p>
            ) : (
              <>
                <Separator className="bg-[#abd1c6]/15" />
                <div className={cn(compact ? "space-y-2" : "space-y-3")}>
                  {storyHelp?.notice && (
                    <p
                      className={cn(
                        "rounded-lg border border-amber-500/30 bg-amber-950/25 text-amber-100/95",
                        compact ? "px-3 py-2 text-xs" : "px-3 py-2.5 text-sm",
                      )}
                    >
                      {storyHelp.notice}
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2">
                    <Label
                      htmlFor={`good-deed-story-${task.id}`}
                      className={cn("text-[#abd1c6]", compact && "text-xs")}
                    >
                      Рассказ
                    </Label>
                    <span
                      className={cn(
                        "tabular-nums text-xs font-medium",
                        storyText.trim().length >= MIN_GOOD_DEED_STORY_CHARS
                          ? "text-emerald-300/90"
                          : "text-[#94a1b2]",
                      )}
                    >
                      {storyText.trim().length}/{MIN_GOOD_DEED_STORY_CHARS}{" "}
                      симв.
                    </span>
                  </div>
                  <textarea
                    id={`good-deed-story-${task.id}`}
                    value={storyText}
                    maxLength={MAX_GOOD_DEED_STORY_CHARS}
                    rows={compact ? 4 : 5}
                    disabled={!isAuthenticated}
                    placeholder={storyPlaceholder}
                    onChange={(e) => onStoryTextChange(e.target.value)}
                    className={cn(
                      "min-h-[96px] w-full resize-y rounded-2xl border border-[#abd1c6]/25 bg-[#001e1d]/55 px-3 py-2.5 text-sm leading-relaxed text-[#fffffe] placeholder:text-[#5c6d7a]",
                      "outline-none transition focus:border-[#f9bc60]/45 focus:ring-2 focus:ring-[#f9bc60]/15",
                      !isAuthenticated && "cursor-not-allowed opacity-50",
                    )}
                  />
                </div>
                <div className={cn(compact ? "space-y-2" : "space-y-3")}>
                  <div className="space-y-1">
                    <Label
                      htmlFor={`good-deed-files-${task.id}`}
                      className={cn("text-[#abd1c6]", compact && "text-xs")}
                    >
                      {compact ? "Фото или видео" : "Фото или видео (до 5)"}
                    </Label>
                    {storyHelp?.fileUploadHint && (
                      <p
                        className={cn(
                          "text-[#abd1c6]/90",
                          compact
                            ? "text-[11px] leading-snug"
                            : "text-xs leading-relaxed",
                        )}
                      >
                        {storyHelp.fileUploadHint}
                      </p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl border border-dashed border-[#abd1c6]/35 bg-[#001e1d]/40 text-center transition",
                      compact ? "px-3 py-4" : "px-4 py-6",
                      !isAuthenticated && "opacity-60",
                    )}
                  >
                    <input
                      id={`good-deed-files-${task.id}`}
                      type="file"
                      multiple
                      accept="image/*,video/mp4,video/webm"
                      disabled={!isAuthenticated}
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
                        {compact
                          ? "Добавить файлы"
                          : "Нажмите и выберите файлы"}
                      </span>
                      {!compact && (
                        <span className="text-xs text-[#94a1b2]">
                          JPG, PNG и др., MP4/WebM · до 5 файлов, до 5 МБ каждый
                        </span>
                      )}
                    </label>
                    {selectedFiles.length > 0 && (
                      <p className="mt-3 text-xs font-medium text-[#f9bc60]">
                        К отправке прикреплено файлов: {selectedFiles.length}
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
                Отправить
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
