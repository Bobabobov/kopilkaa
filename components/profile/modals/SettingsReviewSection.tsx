"use client";

import { useCallback, useEffect, useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { throwIfApiFailed, logRouteCatchError } from "@/lib/api/parseApiError";
import { SettingsSection } from "./SettingsFields";

type ViewerReview = {
  id: string;
  content: string;
  createdAt: string;
};

interface SettingsReviewSectionProps {
  userId: string;
  saving: boolean;
  onNotify: (
    type: "success" | "error" | "info",
    title: string,
    message: string,
  ) => void;
}

export function SettingsReviewSection({
  userId,
  saving,
  onNotify,
}: SettingsReviewSectionProps) {
  const [review, setReview] = useState<ViewerReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadReview = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/user/${userId}`, {
        cache: "no-store",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setReview(null);
        return;
      }
      setReview(json?.review ?? null);
    } catch (error) {
      logRouteCatchError("[SettingsReviewSection] load", error);
      setReview(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadReview();
  }, [loadReview]);

  const handleDelete = async () => {
    if (!review || deleting) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      throwIfApiFailed(res, json, "Не удалось удалить отзыв");

      setReview(null);
      setConfirmDelete(false);
      onNotify(
        "success",
        "Отзыв удалён",
        "Чтобы опубликовать следующую историю, оставьте новый отзыв на странице «Отзывы».",
      );
    } catch (error) {
      logRouteCatchError("[SettingsReviewSection] delete", error);
      onNotify(
        "error",
        "Ошибка",
        error instanceof Error ? error.message : "Не удалось удалить отзыв",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading || !review) {
    return null;
  }

  const formattedDate = new Date(review.createdAt).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const busy = saving || deleting;

  return (
    <SettingsSection title="Отзыв">
      <div className="space-y-3 rounded-xl border border-[#abd1c6]/20 bg-[#001e1d]/30 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f9bc60]/30 bg-[#f9bc60]/12 text-[#f9bc60]">
            <LucideIcons.MessageCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#fffffe]">
              Ваш отзыв опубликован
            </p>
            <p className="mt-1 text-xs text-[#94a1b2]">{formattedDate}</p>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#abd1c6]">
              {review.content}
            </p>
          </div>
        </div>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/15 disabled:opacity-50"
          >
            <LucideIcons.Trash2 className="h-4 w-4" />
            Удалить отзыв
          </button>
        ) : (
          <div className="space-y-3 rounded-xl border border-red-400/25 bg-red-500/10 p-3">
            <p className="text-sm text-[#fffffe]">
              Удалить отзыв? Для следующей публикации истории нужно будет
              оставить новый отзыв.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? (
                  <LucideIcons.Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LucideIcons.Trash2 className="h-4 w-4" />
                )}
                Подтвердить удаление
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={busy}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-colors hover:bg-white/10 disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </SettingsSection>
  );
}
