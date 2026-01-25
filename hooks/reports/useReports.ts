// hooks/reports/useReports.ts
// Хук для управления баг-репортами (загрузка, обновление, удаление)
import { useCallback, useState } from "react";
import { BugReport } from "@/app/reports/page";

const PAGE_SIZE = 20;

interface UseReportsProps {
  userId: string | null;
  statusFilter: string;
  page: number;
}

interface UseReportsReturn {
  reports: BugReport[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  loadReports: (nextPage?: number, keepLoading?: boolean) => Promise<void>;
  updateStatus: (reportId: string, newStatus: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
  addReport: (newReport: any) => void;
}

const formatReport = (r: any): BugReport => ({
  id: r.id,
  title: r.title,
  description: r.description,
  category: r.category,
  status: r.status,
  adminComment: r.adminComment,
  createdAt: r.createdAt,
  updatedAt: r.updatedAt,
  user: r.user,
  images: r.images || [],
  likesCount: r.likesCount ?? 0,
  dislikesCount: r.dislikesCount ?? 0,
});

export function useReports({
  userId,
  statusFilter,
  page,
}: UseReportsProps): UseReportsReturn {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  const loadReports = useCallback(
    async (nextPage = page, keepLoading = true) => {
      if (!userId) return;
      if (keepLoading) setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(
          `/api/bug-reports?status=${statusFilter}&page=${nextPage}&limit=${PAGE_SIZE}`,
          { cache: "no-store", signal: controller.signal },
        );

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Ошибка загрузки (${res.status})`);
        }

        const data = await res.json();
        setReports((data.reports || []).map(formatReport));
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          setError("Сервер долго не отвечает. Попробуйте позже.");
        } else {
          setError(err?.message || "Не удалось загрузить список");
        }
        setReports([]);
        setTotalPages(1);
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    },
    [userId, statusFilter, page],
  );

  const updateStatus = useCallback(
    async (reportId: string, newStatus: string) => {
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r)),
      );

      try {
        const res = await fetch(`/api/admin/bug-reports/${reportId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!res.ok) {
          throw new Error(`Статус не обновлён (${res.status})`);
        }
      } catch (err) {
        console.error("Update status error:", err);
        // Откатываем
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: r.status } : r)),
        );
      }
    },
    [],
  );

  const deleteReport = useCallback(
    async (reportId: string) => {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      try {
        const res = await fetch(`/api/admin/bug-reports/${reportId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error(`Не удалось удалить (${res.status})`);
        }
      } catch (err) {
        console.error("Delete report error:", err);
        // При ошибке перезагружаем список
        loadReports(page);
      }
    },
    [loadReports, page],
  );

  const addReport = useCallback((newReport: any) => {
    if (newReport) {
      const formatted = formatReport(newReport);
      setReports((prev) => [formatted, ...prev]);
    }
  }, []);

  return {
    reports,
    loading,
    error,
    totalPages,
    loadReports,
    updateStatus,
    deleteReport,
    addReport,
  };
}
