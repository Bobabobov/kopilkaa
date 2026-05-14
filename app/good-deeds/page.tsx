"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { GoodDeedsFeedSection } from "./_components/GoodDeedsFeedSection";
import { GoodDeedsHero } from "./_components/GoodDeedsHero";
import { GoodDeedsPageSkeleton } from "./_components/GoodDeedsPageSkeleton";
import { GoodDeedsTasksPanel } from "./_components/GoodDeedsTasksPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { MIN_GOOD_DEED_STORY_CHARS } from "@/lib/goodDeeds";
import type { GoodDeedsResponse } from "./types";
import { throwIfApiFailed, logRouteCatchError } from "@/lib/api/parseApiError";

export default function GoodDeedsPage() {
  const [data, setData] = useState<GoodDeedsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [filesByTask, setFilesByTask] = useState<Record<string, File[]>>({});
  const [storyByTask, setStoryByTask] = useState<Record<string, string>>({});
  const { showToast, ToastComponent } = useBeautifulToast();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/good-deeds", { cache: "no-store" });
      const json = await res.json();
      throwIfApiFailed(res, json, "Не удалось загрузить раздел «Добрые дела»");
      setData(json as GoodDeedsResponse);
    } catch (error) {
      logRouteCatchError("[GoodDeedsPage] load", error);
      showToast("error", "Ошибка", "Не удалось загрузить добрые дела");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch((error) =>
      logRouteCatchError("[GoodDeedsPage] load (effect)", error),
    );
  }, []);

  const onFilesChange = (taskId: string, fileList: FileList | null) => {
    const selected = fileList ? Array.from(fileList) : [];
    setFilesByTask((prev) => ({ ...prev, [taskId]: selected }));
  };

  const onStoryChange = (taskId: string, value: string) => {
    setStoryByTask((prev) => ({ ...prev, [taskId]: value }));
  };

  const submitTask = async (taskId: string) => {
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
    if (files.length < 1) {
      showToast(
        "warning",
        "Добавьте фото или видео",
        "Без вложения мы не сможем проверить отчёт",
      );
      return;
    }
    if (files.length > 5) {
      showToast("warning", "Слишком много файлов", "Максимум 5 файлов");
      return;
    }

    setSubmittingTaskId(taskId);
    try {
      const fd = new FormData();
      files.forEach((file) => fd.append("files", file));

      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: fd,
      });
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
        "Мы проверим и начислим бонусы, если всё в порядке",
      );
      setFilesByTask((prev) => ({ ...prev, [taskId]: [] }));
      setStoryByTask((prev) => ({ ...prev, [taskId]: "" }));
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

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,188,96,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 70%, rgba(171,209,198,0.08) 0%, transparent 45%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)
          `,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,188,96,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,188,96,0.2) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <main className="relative z-10 mx-auto max-w-7xl px-3 pb-12 pt-6 sm:px-4 sm:pb-16 sm:pt-10">
        {loading || !data ? (
          <GoodDeedsPageSkeleton />
        ) : (
          <div className="space-y-8 sm:space-y-10">
            <GoodDeedsHero
              isAuthenticated={data.viewer.isAuthenticated}
              withdrawStats={
                data.viewer.isAuthenticated ? data.stats : undefined
              }
              showToast={showToast}
              onWithdrawSuccess={() =>
                load().catch((error) =>
                  logRouteCatchError("[GoodDeedsPage] load (withdraw)", error),
                )
              }
            />

            {data.viewer.isAuthenticated ? (
              <GoodDeedsTasksPanel
                weekLabel={data.week.label}
                weeklyProgress={data.weeklyProgress}
                tasks={tasks}
                filesByTask={filesByTask}
                storyByTask={storyByTask}
                onStoryChange={onStoryChange}
                onFilesChange={onFilesChange}
                onSubmit={submitTask}
                submittingTaskId={submittingTaskId}
                isAuthenticated={data.viewer.isAuthenticated}
              />
            ) : (
              <Card
                variant="darkGlass"
                className="border-[#f9bc60]/25 bg-gradient-to-br from-[#004643]/45 to-[#001e1d]/70"
              >
                <div role="status" aria-live="polite">
                  <h2 className="text-lg font-bold text-[#fffffe] sm:text-xl">
                    Выполнение добрых дел доступно только после входа
                  </h2>
                  <p className="mt-2 text-sm text-[#abd1c6]/95">
                    Чтобы отправлять отчёты и получать бонусы, войдите в аккаунт
                    или зарегистрируйтесь.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    asChild
                    className="bg-[#f9bc60] text-[#001e1d] hover:bg-[#f7b24a]"
                  >
                    <Link href="/login">Войти</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#abd1c6]/35 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:bg-[#f9bc60]/10 hover:text-[#fffffe]"
                  >
                    <Link href="/register">Регистрация</Link>
                  </Button>
                </div>
              </Card>
            )}

            <GoodDeedsFeedSection
              items={data.feed}
              onBeFirst={() =>
                showToast(
                  "info",
                  "+300 бонусов навсегда одному",
                  "Их получит первый участник, чей отчёт одобрят для общей ленты — сумма добавится к бонусам отчёта автоматически.",
                )
              }
            />
          </div>
        )}
      </main>

      <ToastComponent />
    </div>
  );
}
