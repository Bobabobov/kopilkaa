import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { throwIfApiFailed } from "@/lib/api/parseApiError";

type ReviewUser = {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
  avatarFrame?: string | null;
  vkLink?: string | null;
  telegramLink?: string | null;
  youtubeLink?: string | null;
  trust: {
    status: string;
    approved: number;
    supportRange: string;
    nextRequirement: string | null;
  };
  isSelf?: boolean;
};

export type ReviewItem = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  images: { url: string; sort: number }[];
  user: ReviewUser;
};

type PendingReviewApplication = { id: string; title: string } | null;

export interface UseReviewsOptions {
  /** По умолчанию 12 (страница отзывов); на главной — меньше, чтобы не тянуть лишнее. */
  limit?: number;
}

type ReviewsResponse = {
  limit: number;
  items: ReviewItem[];
  total: number;
  page: number;
  pages: number;
  viewer?: {
    canReview: boolean;
    approvedApplications: number;
    pendingReviewApplication: PendingReviewApplication;
    review: ReviewItem | null;
  };
};

export function useReviews(options?: UseReviewsOptions) {
  const pageLimit = Math.min(30, Math.max(1, options?.limit ?? 12));
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const { showToast, ToastComponent } = useBeautifulToast();
  const showToastRef = useRef(showToast);

  // держим последнюю версию showToast без пересоздания эффектов
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  const fetchReviews = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageLimit),
      });
      try {
        const res = await fetch(`/api/reviews?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const json = (await res
          .json()
          .catch(() => null)) as ReviewsResponse | null;
        throwIfApiFailed(res, json, "Не удалось загрузить отзывы");
        if (!json) throw new Error("Не удалось загрузить отзывы");
        if (append) {
          setData((prev) => {
            if (!prev) return json;
            return {
              ...prev,
              items: [...(prev.items ?? []), ...(json.items ?? [])],
              total: json.total ?? prev.total,
              page: json.page ?? prev.page,
              pages: json.pages ?? prev.pages,
              viewer: json.viewer ?? prev.viewer,
            };
          });
        } else {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
        if (!append) {
          showToastRef.current?.(
            "error",
            "Ошибка",
            "Не удалось загрузить отзывы",
          );
          setData(null);
        }
      } finally {
        clearTimeout(timeout);
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [pageLimit],
  );

  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  const loadMore = useCallback(() => {
    if (loadingMore || !data) return;
    if (data.page >= data.pages) return;
    fetchReviews(data.page + 1, true).catch(console.error);
  }, [loadingMore, data, fetchReviews]);

  const submitReview = useCallback(
    async (
      applicationId: string,
      content: string,
      files: File[],
      existingUrls: string[] = [],
    ) => {
      if (submitting) return;
      if (!applicationId) {
        showToastRef.current?.(
          "error",
          "Ошибка",
          "Не указана заявка для отзыва",
        );
        return;
      }
      if (!content.trim()) {
        showToastRef.current?.("error", "Ошибка", "Добавьте текст отзыва");
        return;
      }
      if (content.trim().length < 50) {
        showToastRef.current?.(
          "error",
          "Ошибка",
          "Опишите опыт подробнее (минимум 50 символов)",
        );
        return;
      }
      if (content.trim().length > 1200) {
        showToastRef.current?.(
          "error",
          "Ошибка",
          "Текст не должен превышать 1200 символов",
        );
        return;
      }
      if (existingUrls.length + files.length < 1) {
        showToastRef.current?.(
          "error",
          "Ошибка",
          "Добавьте хотя бы одно фото (чек, товар или результат)",
        );
        return;
      }
      if (existingUrls.length + files.length > 5) {
        showToastRef.current?.("error", "Можно прикрепить не более 5 фото");
        return;
      }

      setSubmitting(true);
      try {
        const uploadedUrls: string[] = [...existingUrls];
        if (files.length) {
          const fd = new FormData();
          files.forEach((f) => fd.append("files", f));
          const uploadRes = await fetch("/api/uploads", {
            method: "POST",
            body: fd,
          });
          const uploadJson = await uploadRes.json();
          throwIfApiFailed(uploadRes, uploadJson, "Ошибка загрузки файлов");
          uploadedUrls.push(
            ...((uploadJson.files as { url: string }[]) || []).map(
              (f) => f.url,
            ),
          );
        }
        const images = uploadedUrls.slice(0, 5);
        if (images.length < 1) {
          throw new Error("Добавьте хотя бы одно фото");
        }

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId,
            content: content.trim(),
            images,
          }),
        });
        const json = await res.json();
        throwIfApiFailed(res, json, "Не удалось сохранить отзыв");

        showToastRef.current?.("success", "Готово", "Отзыв сохранён");

        setData((prev) => {
          if (!prev) return prev;
          const updatedReview = json.review as ReviewItem;
          const items = [
            updatedReview,
            ...(prev.items ?? []).filter((r) => r.id !== updatedReview.id),
          ];
          return {
            ...prev,
            items,
            total: Math.max(prev.total ?? 0, items.length),
            viewer: prev.viewer
              ? {
                  ...prev.viewer,
                  pendingReviewApplication: null,
                  review: updatedReview,
                  canReview: false,
                }
              : prev.viewer,
          };
        });
      } catch (error: any) {
        console.error("Submit review error", error);
        showToastRef.current?.(
          "error",
          "Ошибка",
          error?.message || "Не удалось сохранить отзыв",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [submitting],
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      if (submitting) return;

      setSubmitting(true);
      try {
        const res = await fetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
        });
        const json = await res.json();
        throwIfApiFailed(res, json, "Не удалось удалить отзыв");

        showToastRef.current?.("success", "Готово", "Отзыв удалён");

        // Обновляем данные с сервера (чтобы получить актуальный pendingReviewApplication)
        fetchReviews(1, false);
      } catch (error: any) {
        console.error("Delete review error", error);
        showToastRef.current?.(
          "error",
          "Ошибка",
          error?.message || "Не удалось удалить отзыв",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [submitting],
  );

  const viewerReview = useMemo(() => data?.viewer?.review ?? null, [data]);
  const pendingReviewApplication = useMemo(
    () => data?.viewer?.pendingReviewApplication ?? null,
    [data],
  );

  const reviews = useMemo(() => data?.items ?? [], [data]);
  const total = data?.total ?? 0;
  const hasMore = Boolean(data && data.page < data.pages);

  return {
    loading,
    loadingMore,
    submitting,
    reviews,
    total,
    hasMore,
    canReview: data?.viewer?.canReview ?? false,
    approvedApplications: data?.viewer?.approvedApplications ?? 0,
    pendingReviewApplication,
    viewerReview,
    refresh: () => fetchReviews(1, false),
    loadMore,
    submitReview,
    deleteReview,
    ToastComponent,
  };
}
