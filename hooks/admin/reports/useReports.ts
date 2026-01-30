import { useState, useEffect, useCallback, useRef } from "react";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";

// Тип для функции showToast
type ShowToast = (
  type: "success" | "error" | "info" | "warning",
  title: string,
  message?: string,
) => void;

export interface Report {
  id: string;
  reason: string;
  status: string;
  adminComment: string | null;
  createdAt: string;
  reporter: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
  reported: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    isBanned: boolean;
    bannedUntil: string | null;
  };
}

export function useReports(statusFilter: string) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useBeautifulToast();
  const showToastRef = useRef<ShowToast>(showToast);

  // Обновляем ref при изменении showToast
  useEffect(() => {
    showToastRef.current = showToast;
  }, [showToast]);

  // Автоматическая загрузка при изменении фильтра
  useEffect(() => {
    let cancelled = false;

    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/admin/reports?status=${statusFilter}`,
          {
            cache: "no-store",
          },
        );

        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          setReports(data.reports || []);
        } else {
          const errorData = await response.json().catch(() => ({}));
          if (!cancelled) {
            showToastRef.current(
              "error",
              "Ошибка",
              errorData.message || "Не удалось загрузить жалобы",
            );
            setReports([]);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Load reports error:", error);
          showToastRef.current(
            "error",
            "Ошибка",
            "Не удалось загрузить жалобы",
          );
          setReports([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  // Функция для ручной перезагрузки
  const loadReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/reports?status=${statusFilter}`,
        {
          cache: "no-store",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        showToastRef.current(
          "error",
          "Ошибка",
          errorData.message || "Не удалось загрузить жалобы",
        );
        setReports([]);
      }
    } catch (error) {
      console.error("Load reports error:", error);
      showToastRef.current("error", "Ошибка", "Не удалось загрузить жалобы");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const updateReportStatus = useCallback(
    async (reportId: string, newStatus: string) => {
      try {
        const response = await fetch(`/api/admin/reports/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          showToastRef.current(
            "success",
            "Статус обновлён",
            "Жалоба обработана",
          );
          // Перезагружаем жалобы
          await loadReports();
          return true;
        } else {
          const errorData = await response.json().catch(() => ({}));
          showToastRef.current(
            "error",
            "Ошибка",
            errorData.message || "Не удалось обновить статус",
          );
          return false;
        }
      } catch (error) {
        console.error("Update report status error:", error);
        showToastRef.current("error", "Ошибка", "Не удалось обновить статус");
        return false;
      }
    },
    [loadReports],
  );

  return {
    reports,
    loading,
    loadReports,
    updateReportStatus,
  };
}
