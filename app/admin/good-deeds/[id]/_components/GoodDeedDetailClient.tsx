"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock3,
  Gift,
  Trash2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageLightbox from "@/app/admin/_components/ImageLightbox";
import {
  AdminActionButtons,
  AdminAlert,
  AdminPanel,
  AdminSectionLabel,
  AdminStatusPill,
  adminFieldClass,
  adminLabelClass,
} from "@/app/admin/_components/admin-ui";
import { REJECT_TEMPLATES, STATUS_LABELS } from "@/app/admin/good-deeds/_lib/constants";
import { throwIfApiFailed } from "@/lib/api/parseApiError";
import { formatDateTime } from "@/lib/time";
import type { GoodDeedSubmissionDetailDto } from "@/lib/admin/goodDeedSubmissions";

const MIN_STORY_LENGTH = 100;

function looksLikeGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 30) return false;
  const chars = trimmed.replace(/\s/g, "");
  if (!chars) return false;
  const uniqueRatio = new Set(chars).size / chars.length;
  return uniqueRatio < 0.15;
}

interface GoodDeedDetailClientProps {
  submissionId: string;
}

export function GoodDeedDetailClient({ submissionId }: GoodDeedDetailClientProps) {
  const router = useRouter();
  const [item, setItem] = useState<GoodDeedSubmissionDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [lightbox, setLightbox] = useState({ isOpen: false, index: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/good-deeds/submissions/${submissionId}`, {
          cache: "no-store",
        });
        const json = await res.json();
        throwIfApiFailed(res, json, "Не удалось загрузить отчёт");
        if (cancelled) return;
        const data = json?.data as GoodDeedSubmissionDetailDto;
        setItem(data);
        setRejectComment(data?.adminComment || "");
      } catch (err) {
        if (!cancelled) {
          setItem(null);
          setError(err instanceof Error ? err.message : "Ошибка загрузки");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const imageUrls = useMemo(
    () =>
      (item?.media ?? [])
        .filter((m) => m.type === "IMAGE")
        .map((m) => m.url),
    [item?.media],
  );

  const goBack = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("admin-scroll", String(window.scrollY));
    }
    router.push("/admin/good-deeds");
  };

  const patchStatus = async (action: "approve" | "reject") => {
    if (!item) return;
    if (action === "reject" && !rejectComment.trim()) {
      setError("При отклонении укажите причину в комментарии");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminComment: rejectComment.trim(),
        }),
      });
      const json = await res.json();
      throwIfApiFailed(res, json, "Не удалось обновить статус");
      goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!item || !window.confirm("Удалить отчёт безвозвратно?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/good-deeds/submissions/${item.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      throwIfApiFailed(res, json, "Не удалось удалить");
      goBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка");
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-[#abd1c6]">
        Загрузка…
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-[#e16162]">{error || "Отчёт не найден"}</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin/good-deeds">
            <ArrowLeft className="mr-2 h-4 w-4" />
            К списку
          </Link>
        </Button>
      </div>
    );
  }

  const storyLen = item.storyText.trim().length;
  const isPending = item.status === "PENDING";
  const storyShort = storyLen > 0 && storyLen < MIN_STORY_LENGTH;
  const noMedia = item.media.length === 0;
  const noStory = storyLen === 0;
  const gibberish = looksLikeGibberish(item.storyText);
  const hasWarnings =
    isPending && (noStory || storyShort || noMedia || gibberish);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-3">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-[#abd1c6]/30 text-[#abd1c6] hover:border-[#f9bc60]/50 hover:text-[#f9bc60]"
        >
          <Link href="/admin/good-deeds">
            <ArrowLeft className="mr-2 h-4 w-4" />
            К очереди
          </Link>
        </Button>
        <AdminStatusPill
          tone={
            item.status === "APPROVED"
              ? "success"
              : item.status === "REJECTED"
                ? "danger"
                : "pending"
          }
        >
          {STATUS_LABELS[item.status]}
        </AdminStatusPill>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-8">
        <div className="min-w-0 space-y-5">
          {/* Задание — главный ориентир */}
          <AdminPanel title="Задание на проверку" accent="gold">
            <div className="border-l-4 border-[#f9bc60] pl-4">
              <h1 className="text-2xl font-bold text-[#fffffe]">{item.taskTitle}</h1>
              <p className="mt-3 text-base leading-relaxed text-[#e6fffb]/95">
                {item.taskDescription}
              </p>
            </div>
          </AdminPanel>

          {hasWarnings ? (
            <AdminAlert title="Обратите внимание">
              <ul className="list-inside list-disc">
                {noStory ? <li>Рассказ не заполнен</li> : null}
                {storyShort ? (
                  <li>
                    Короткий рассказ — {storyLen} из {MIN_STORY_LENGTH} символов
                  </li>
                ) : null}
                {gibberish ? (
                  <li>Похоже на бессмысленный набор символов</li>
                ) : null}
                {noMedia ? <li>Нет фото или видео</li> : null}
              </ul>
            </AdminAlert>
          ) : null}

          {/* Рассказ */}
          <section>
            <AdminSectionLabel accent="gold">Рассказ участника</AdminSectionLabel>
            <div
              className={`rounded-2xl border-2 p-4 ${
                gibberish || noStory
                  ? "border-rose-400/35 bg-rose-950/25"
                  : storyShort
                    ? "border-amber-400/35 bg-amber-950/20"
                    : "border-[#abd1c6]/20 bg-[#001e1d]/50"
              }`}
            >
              {noStory ? (
                <p className="text-sm font-medium text-rose-300">Не заполнен</p>
              ) : (
                <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-[#fffffe] [overflow-wrap:anywhere]">
                  {item.storyText}
                </p>
              )}
              {!noStory ? (
                <p className="mt-3 text-xs text-[#94a1b2]">{storyLen} символов</p>
              ) : null}
            </div>
          </section>

          {/* Материалы */}
          <section>
            <AdminSectionLabel accent="emerald">
              Доказательства · {item.media.length} файл(ов)
            </AdminSectionLabel>
            {noMedia ? (
              <div className="rounded-2xl border-2 border-dashed border-rose-400/40 bg-rose-950/20 px-4 py-8 text-center text-sm font-medium text-rose-300">
                Материалы не приложены
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {item.media.map((media, i) => (
                  <div
                    key={media.url}
                    className="overflow-hidden rounded-2xl border-2 border-[#abd1c6]/25 bg-black/40 ring-1 ring-white/5"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-3 py-1.5">
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]">
                        {media.type === "VIDEO" ? "Видео" : "Фото"} {i + 1}
                      </span>
                      <span className="rounded bg-[#f9bc60]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#f9bc60]">
                        Смотреть
                      </span>
                    </div>
                    {media.type === "VIDEO" ? (
                      <video
                        src={media.url}
                        controls
                        className="aspect-video w-full bg-black"
                      />
                    ) : (
                      <button
                        type="button"
                        className="block w-full"
                        onClick={() => {
                          const idx = imageUrls.indexOf(media.url);
                          if (idx >= 0) setLightbox({ isOpen: true, index: idx });
                        }}
                      >
                        <img
                          src={media.url}
                          alt=""
                          className="max-h-[480px] w-full object-contain bg-black/50"
                        />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Решение */}
        <aside className="mt-8 lg:sticky lg:top-4 lg:mt-0">
          <AdminPanel
            title="Решение"
            subtitle={isPending ? "Требует вашего вердикта" : undefined}
            accent="gold"
            className="shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#abd1c6]/15 bg-black/25 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f9bc60]/15 text-[#f9bc60]">
                  <User className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <Link
                    href={`/admin/users/${item.user.id}`}
                    className="block truncate font-semibold text-[#fffffe] hover:text-[#f9bc60] hover:underline"
                  >
                    {item.user.name}
                    {item.user.username ? ` (@${item.user.username})` : ""}
                  </Link>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-[#94a1b2]">
                    <Clock3 className="h-3 w-3" />
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-[#f9bc60]/30 bg-[#f9bc60]/10 px-4 py-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[#abd1c6]">
                  <Gift className="h-4 w-4 text-[#f9bc60]" />
                  Награда
                </span>
                <span className="text-2xl font-black text-[#f9bc60]">
                  +{item.reward}
                </span>
              </div>

              {item.adminComment && !isPending ? (
                <p className="rounded-xl border border-[#abd1c6]/20 bg-black/20 px-3 py-2 text-sm text-[#abd1c6]">
                  {item.adminComment}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              {isPending ? (
                <>
                  <AdminActionButtons
                    disabled={busy}
                    onApprove={() => patchStatus("approve")}
                    onReject={() => patchStatus("reject")}
                    approveLabel="Подтвердить"
                    rejectLabel="Отклонить"
                    className="grid-cols-1"
                  />

                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-rose-300/90">
                      Причины отклонения
                    </p>
                    <div className="flex flex-col gap-2">
                      {REJECT_TEMPLATES.map((template) => (
                        <button
                          key={template}
                          type="button"
                          onClick={() => setRejectComment(template)}
                          className={`rounded-xl border px-3 py-2.5 text-left text-xs leading-snug transition ${
                            rejectComment === template
                              ? "border-[#f9bc60] bg-[#f9bc60]/15 text-[#fffffe] ring-1 ring-[#f9bc60]/40"
                              : "border-rose-400/25 bg-rose-950/30 text-[#abd1c6] hover:border-rose-400/50 hover:text-[#fffffe]"
                          }`}
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={adminLabelClass}>
                      Комментарий автору
                    </label>
                    <textarea
                      value={rejectComment}
                      onChange={(e) => setRejectComment(e.target.value)}
                      placeholder="Обязательно при отклонении"
                      rows={4}
                      className={`${adminFieldClass} resize-y`}
                    />
                  </div>
                </>
              ) : null}

              <button
                type="button"
                disabled={busy}
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs text-[#abd1c6]/50 transition hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Удалить отчёт
              </button>
            </div>
          </AdminPanel>
        </aside>
      </div>

      <ImageLightbox
        isOpen={lightbox.isOpen}
        images={imageUrls}
        currentIndex={lightbox.index}
        onClose={() => setLightbox({ isOpen: false, index: 0 })}
        onIndexChange={(index) => setLightbox((prev) => ({ ...prev, index }))}
      />
    </div>
  );
}
