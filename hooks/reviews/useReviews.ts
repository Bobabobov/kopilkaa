import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useBeautifulToast } from "@/components/ui/BeautifulToast";

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

type ReviewsResponse = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  items: ReviewItem[];
  viewer: {
    canReview: boolean;
    approvedApplications: number;
    review: ReviewItem | null;
  };
};

export function useReviews() {
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
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      try {
        const res = await fetch(`/api/reviews?page=${page}&limit=12`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Не удалось загрузить отзывы");
        }
        const json = (await res.json()) as ReviewsResponse;
        if (append) {
          setData((prev) => {
            if (!prev) return json;
            return {
              ...json,
              items: [...prev.items, ...json.items],
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
    [],
  );

  useEffect(() => {
    fetchReviews(1, false);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setData((currentData) => {
      if (!currentData || currentData.page >= currentData.pages)
        return currentData;
      // Запускаем загрузку асинхронно
      fetchReviews(currentData.page + 1, true).catch(console.error);
      return currentData;
    });
  }, [loadingMore, fetchReviews]);

  const submitReview = useCallback(
    async (content: string, files: File[], existingUrls: string[] = []) => {
      if (submitting) return;
      if (!content.trim()) {
        showToastRef.current?.("error", "Ошибка", "Добавьте текст отзыва");
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
      if (files.length > 5) {
        showToastRef.current?.("error", "Можно прикрепить не более 5 фото");
        return;
      }

      setSubmitting(true);
      try {
        const uploadedUrls: string[] = [];
        if (files.length) {
          const fd = new FormData();
          files.forEach((f) => fd.append("files", f));
          const uploadRes = await fetch("/api/uploads", {
            method: "POST",
            body: fd,
          });
          const uploadJson = await uploadRes.json();
          if (!uploadRes.ok) {
            throw new Error(uploadJson?.error || "Ошибка загрузки файлов");
          }
          uploadedUrls.push(
            ...((uploadJson.files as { url: string }[]) || []).map(
              (f) => f.url,
            ),
          );
        }

        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: content.trim(),
            images: [...existingUrls, ...uploadedUrls].slice(0, 5),
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Не удалось сохранить отзыв");
        }

        showToastRef.current?.("success", "Готово", "Отзыв сохранён");

        setData((prev) => {
          if (!prev) return prev;
          const updatedReview = json.review as ReviewItem;
          const items = [
            updatedReview,
            ...prev.items.filter((r) => r.id !== updatedReview.id),
          ].slice(0, prev.limit);
          return {
            ...prev,
            items,
            viewer: {
              ...prev.viewer,
              review: updatedReview,
              canReview: true,
            },
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
        if (!res.ok) {
          throw new Error(json?.error || "Не удалось удалить отзыв");
        }

        showToastRef.current?.("success", "Готово", "Отзыв удалён");

        // Обновляем данные: удаляем отзыв из списка и очищаем viewerReview
        setData((prev) => {
          if (!prev) return prev;
          const canReviewAfterDelete = prev.viewer.approvedApplications > 0;
          return {
            ...prev,
            total: Math.max(0, prev.total - 1),
            items: prev.items.filter((r) => r.id !== reviewId),
            viewer: {
              ...prev.viewer,
              review: null,
              canReview: canReviewAfterDelete,
            },
          };
        });
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

  const hasMore = useMemo(() => {
    if (!data) return false;
    return data.page < data.pages;
  }, [data]);

  return {
    loading,
    loadingMore,
    submitting,
    reviews: data?.items ?? [],
    total: data?.total ?? 0,
    currentPage: data?.page ?? 1,
    totalPages: data?.pages ?? 0,
    hasMore,
    canReview: data?.viewer?.canReview ?? false,
    approvedApplications: data?.viewer?.approvedApplications ?? 0,
    viewerReview,
    refresh: () => fetchReviews(1, false),
    loadMore,
    submitReview,
    deleteReview,
    ToastComponent,
  };
}
