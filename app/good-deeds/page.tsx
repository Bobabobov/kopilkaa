"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { GoodDeedsFeedSection } from "./_components/GoodDeedsFeedSection";
import { GoodDeedsHero } from "./_components/GoodDeedsHero";
import { GoodDeedsPageSkeleton } from "./_components/GoodDeedsPageSkeleton";
import { GoodDeedsParticipationBar } from "./_components/GoodDeedsParticipationBar";
import { GoodDeedsSubmitModal } from "./_components/GoodDeedsSubmitModal";
import { GoodDeedsPageBackground } from "./_components/good-deeds-ui/GoodDeedsPageBackground";
import {
  hasGoodDeedPhotoAndVideoFiles,
  MIN_GOOD_DEED_STORY_CHARS,
} from "@/lib/goodDeeds";
import {
  GOOD_DEEDS_SUBMISSIONS_CLOSED,
  GOOD_DEEDS_SUBMISSIONS_CLOSED_MESSAGE,
} from "@/lib/goodDeedsSubmissions";
import type { GoodDeedsResponse } from "./types";
import { throwIfApiFailed, logRouteCatchError } from "@/lib/api/parseApiError";
import { recordFeedbackMeaningfulAction } from "@/lib/feedback/promptStorage";
import { validateGoodDeedMediaFile } from "@/lib/uploads/limits";

export default function GoodDeedsPage() {
  const [data, setData] = useState<GoodDeedsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [filesByTask, setFilesByTask] = useState<Record<string, File[]>>({});
  const [storyByTask, setStoryByTask] = useState<Record<string, string>>({});
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [initialTaskId, setInitialTaskId] = useState<string | null>(null);
  const { showToast } = useBeautifulToast();
  const showToastRef = useRef(showToast);

  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/good-deeds", { cache: "no-store" });
      const json = await res.json();
      throwIfApiFailed(res, json, "Не удалось загрузить раздел «Добрые дела»");
      setData(json as GoodDeedsResponse);
    } catch (error) {
      logRouteCatchError("[GoodDeedsPage] load", error);
      showToastRef.current(
        "error",
        "Ошибка",
        "Не удалось загрузить добрые дела",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load().catch((error) =>
      logRouteCatchError("[GoodDeedsPage] load (effect)", error),
    );
  }, [load]);

  const openSubmitModal = useCallback((taskId?: string) => {
    setInitialTaskId(taskId ?? null);
    setSubmitModalOpen(true);
  }, []);

  const closeSubmitModal = useCallback(() => {
    setSubmitModalOpen(false);
    setInitialTaskId(null);
  }, []);

  const onMediaFileChange = (
    taskId: string,
    kind: "photo" | "video",
    fileList: FileList | null,
  ) => {
    const incoming = fileList ? Array.from(fileList) : [];
    setFilesByTask((prev) => {
      const current = prev[taskId] ?? [];
      const kept =
        kind === "photo"
          ? current.filter((file) => file.type.startsWith("video/"))
          : current.filter((file) => file.type.startsWith("image/"));
      const added =
        kind === "photo"
          ? incoming.filter((file) => file.type.startsWith("image/"))
          : incoming.filter((file) => file.type.startsWith("video/"));
      return { ...prev, [taskId]: [...kept, ...added] };
    });
  };

  const onStoryChange = (taskId: string, value: string) => {
    setStoryByTask((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitTask = async (taskId: string) => {
    if (GOOD_DEEDS_SUBMISSIONS_CLOSED) {
      showToast(
        "warning",
        "Приём закрыт",
        GOOD_DEEDS_SUBMISSIONS_CLOSED_MESSAGE,
      );
      return;
    }

    if (!data?.viewer?.isAuthenticated) {
      showToast(
        "warning",
        "Нужна авторизация",
        "Войдите, чтобы отправить отчёт",
      );
      return;
    }

    const trimmedStory = (storyByTask[taskId] ?? "").trim();
    if (trimmedStory.length < MIN_GOOD_DEED_STORY_CHARS) {
      showToast(
        "warning",
        "Нужен рассказ",
        `Расскажите подробнее — минимум ${MIN_GOOD_DEED_STORY_CHARS} символов`,
      );
      return;
    }

    const files = filesByTask[taskId] ?? [];
    if (!hasGoodDeedPhotoAndVideoFiles(files)) {
      showToast(
        "warning",
        "Нужны фото и видео",
        "Приложите фото и видео: на фото — видно «Копилка», в видео — видно и слышно",
      );
      return;
    }
    if (files.length > 5) {
      showToast("warning", "Слишком много файлов", "Максимум 5 файлов");
      return;
    }

    for (const file of files) {
      const kind = file.type.startsWith("video/") ? "video" : "photo";
      const validationError = validateGoodDeedMediaFile(file, kind);
      if (validationError) {
        showToast("warning", "Файл не подходит", validationError);
        return;
      }
    }

    setSubmittingTaskId(taskId);
    try {
      const fd = new FormData();
      files.forEach((file) => fd.append("files", file));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120_000);

      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const uploadJson = await uploadRes.json();
      throwIfApiFailed(uploadRes, uploadJson, "Ошибка загрузки медиа");
      const mediaUrls = ((uploadJson?.files as { url: string }[]) || []).map(
        (item) => item.url,
      );

      const submitRes = await fetch("/api/good-deeds/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          mediaUrls,
          storyText: trimmedStory,
        }),
      });
      const submitJson = await submitRes.json();
      throwIfApiFailed(
        submitRes,
        submitJson,
        "Не удалось отправить отчёт на проверку",
      );

      showToast(
        "success",
        "Отчёт отправлен",
        "Мы проверим отчёт и сообщим результат",
      );
      recordFeedbackMeaningfulAction();
      setFilesByTask((prev) => ({ ...prev, [taskId]: [] }));
      setStoryByTask((prev) => ({ ...prev, [taskId]: "" }));
      closeSubmitModal();
      await load();
    } catch (error) {
      logRouteCatchError("[GoodDeedsPage] submitTask", error);
      showToast(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось отправить задание",
      );
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const tasks = data?.weeklyTasks ?? [];
  const isAuthenticated = data?.viewer.isAuthenticated ?? false;

  const handleBeFirst = useCallback(() => {
    showToast(
      "info",
      "Первый в ленте",
      "Станьте первым участником, чей отчёт появится в общей ленте после модерации.",
    );
    if (isAuthenticated) {
      openSubmitModal();
      return;
    }
    document
      .getElementById("good-deeds-participate")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isAuthenticated, openSubmitModal, showToast]);

  return (
    <div className="relative min-h-screen">
      <GoodDeedsPageBackground />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-4 sm:pb-20 sm:pt-6">
        {loading || !data ? (
          <GoodDeedsPageSkeleton />
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <GoodDeedsHero
              isAuthenticated={isAuthenticated}
              cycleLabel={data.cycle.label}
            />

            <GoodDeedsParticipationBar
              variant="inline"
              isAuthenticated={isAuthenticated}
              tasks={tasks}
              submissionsClosed={GOOD_DEEDS_SUBMISSIONS_CLOSED}
              onOpenSubmit={openSubmitModal}
            />

            <GoodDeedsFeedSection
              items={data.feed}
              onBeFirst={handleBeFirst}
            />
          </div>
        )}
      </main>

      {isAuthenticated && data ? (
        <>
          <GoodDeedsParticipationBar
            variant="sticky"
            isAuthenticated
            tasks={tasks}
            submissionsClosed={GOOD_DEEDS_SUBMISSIONS_CLOSED}
            onOpenSubmit={openSubmitModal}
          />
          <GoodDeedsSubmitModal
            open={submitModalOpen}
            onClose={closeSubmitModal}
            tasks={tasks}
            initialTaskId={initialTaskId}
            storyByTask={storyByTask}
            filesByTask={filesByTask}
            onStoryChange={onStoryChange}
            onMediaFileChange={onMediaFileChange}
            onMediaValidationError={(message) =>
              showToast("warning", "Файл не подходит", message)
            }
            onSubmit={submitTask}
            submittingTaskId={submittingTaskId}
            submissionsClosed={GOOD_DEEDS_SUBMISSIONS_CLOSED}
            submissionsClosedMessage={GOOD_DEEDS_SUBMISSIONS_CLOSED_MESSAGE}
          />
        </>
      ) : null}

    </div>
  );
}
