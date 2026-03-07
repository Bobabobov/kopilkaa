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

type PendingReviewApplication = { id: string; title: string } | null;

type ReviewsResponse = {
  limit: number;
  itemsOld?: ReviewItem[];
  itemsNew?: ReviewItem[];
  totalOld?: number;
  totalNew?: number;
  items?: ReviewItem[];
  total?: number;
  page?: number;
  pages?: number;
  pageOld?: number;
  pageNew?: number;
  pagesOld?: number;
  pagesNew?: number;
  section?: "old" | "new";
  viewer?: {
    canReview: boolean;
    approvedApplications: number;
    pendingReviewApplication: PendingReviewApplication;
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
    async (page: number = 1, append: boolean = false, section?: "old" | "new") => {
      if (append) setLoadingMore(true);
      else if (!section) setLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (section) params.set("section", section);
      try {
        const res = await fetch(`/api/reviews?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || "Не удалось загрузить отзывы");
        }
        const json = (await res.json()) as ReviewsResponse;
        if (section && append && json.items && json.total !== undefined) {
          const nextPage = json.page ?? 1;
          setData((prev) => {
            if (!prev) return prev;
            if (section === "old") {
              return {
                ...prev,
                itemsOld: [...(prev.itemsOld ?? []), ...json.items!],
                totalOld: json.total ?? prev.totalOld,
                pageOld: nextPage,
                pagesOld: json.pages ?? prev.pagesOld,
              };
            }
            return {
              ...prev,
              itemsNew: [...(prev.itemsNew ?? []), ...json.items!],
              totalNew: json.total ?? prev.totalNew,
              pageNew: nextPage,
              pagesNew: json.pages ?? prev.pagesNew,
            };
          });
        } else if (!section) {
          setData({
            ...json,
            pageOld: 1,
            pageNew: 1,
            pagesOld: Math.ceil((json.totalOld ?? 0) / 12),
            pagesNew: Math.ceil((json.totalNew ?? 0) / 12),
          } as ReviewsResponse & {
            itemsOld: ReviewItem[];
            itemsNew: ReviewItem[];
            pageOld: number;
            pageNew: number;
            pagesOld: number;
            pagesNew: number;
          });
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
        if (!append && !section) {
          showToastRef.current?.("error", "Ошибка", "Не удалось загрузить отзывы");
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
  }, [fetchReviews]);

  const loadMoreOld = useCallback(() => {
    if (loadingMore || !data) return;
    const page = (data as { pageOld?: number }).pageOld ?? 1;
    const pages = (data as { pagesOld?: number }).pagesOld ?? 1;
    if (page >= pages) return;
    fetchReviews(page + 1, true, "old").catch(console.error);
  }, [loadingMore, data, fetchReviews]);

  const loadMoreNew = useCallback(() => {
    if (loadingMore || !data) return;
    const page = (data as { pageNew?: number }).pageNew ?? 1;
    const pages = (data as { pagesNew?: number }).pagesNew ?? 1;
    if (page >= pages) return;
    fetchReviews(page + 1, true, "new").catch(console.error);
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
        showToastRef.current?.("error", "Ошибка", "Не указана заявка для отзыва");
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
          if (!uploadRes.ok) {
            throw new Error(uploadJson?.error || "Ошибка загрузки файлов");
          }
          uploadedUrls.push(
            ...((uploadJson.files as { url: string }[]) || []).map((f) => f.url),
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
        if (!res.ok) {
          throw new Error(json?.error || "Не удалось сохранить отзыв");
        }

        showToastRef.current?.("success", "Готово", "Отзыв сохранён");

        setData((prev) => {
          if (!prev) return prev;
          const updatedReview = json.review as ReviewItem;
          // Новые отзывы всегда в "Что купили на помощь"
          const itemsNew = [
            updatedReview,
            ...(prev.itemsNew ?? []).filter((r) => r.id !== updatedReview.id),
          ];
          return {
            ...prev,
            itemsNew,
            totalNew: Math.max(prev.totalNew ?? 0, itemsNew.length),
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
        if (!res.ok) {
          throw new Error(json?.error || "Не удалось удалить отзыв");
        }

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

  const reviewsOld = useMemo(() => data?.itemsOld ?? [], [data]);
  const reviewsNew = useMemo(() => data?.itemsNew ?? [], [data]);
  const totalOld = data?.totalOld ?? 0;
  const totalNew = data?.totalNew ?? 0;
  const pageOld = (data as { pageOld?: number })?.pageOld ?? 1;
  const pageNew = (data as { pageNew?: number })?.pageNew ?? 1;
  const pagesOld = (data as { pagesOld?: number })?.pagesOld ?? 0;
  const pagesNew = (data as { pagesNew?: number })?.pagesNew ?? 0;
  const hasMoreOld = pageOld < pagesOld;
  const hasMoreNew = pageNew < pagesNew;

  return {
    loading,
    loadingMore,
    submitting,
    reviewsOld,
    reviewsNew,
    totalOld,
    totalNew,
    hasMoreOld,
    hasMoreNew,
    canReview: data?.viewer?.canReview ?? false,
    approvedApplications: data?.viewer?.approvedApplications ?? 0,
    pendingReviewApplication,
    viewerReview,
    refresh: () => fetchReviews(1, false),
    loadMoreOld,
    loadMoreNew,
    submitReview,
    deleteReview,
    ToastComponent,
  };
}
