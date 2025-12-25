"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LucideIcons } from "@/components/ui/LucideIcons";
import UniversalBackground from "@/components/ui/UniversalBackground";
import BugReportForm from "@/components/reports/BugReportForm";
import BugReportList from "@/components/reports/BugReportList";
import BugReportFilters from "@/components/reports/BugReportFilters";

export interface BugReport {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  adminComment?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name?: string | null;
    email: string;
    avatar?: string | null;
  };
  images: { url: string; sort: number }[];
  likesCount: number;
  dislikesCount: number;
}

const PAGE_SIZE = 20;
const ADMIN_EMAILS = ["bobov097@gmail.com"];
const STATUS_PRESETS = [
  { value: "all", label: "Все" },
  { value: "OPEN", label: "Открытые" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "RESOLVED", label: "Решённые" },
  { value: "CLOSED", label: "Закрытые" },
];

export default function ReportsPage() {
  const router = useRouter();

  const [user, setUser] = useState<{ id: string; email?: string; role?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const [reports, setReports] = useState<BugReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = useMemo(() => {
    const roleIsAdmin = user?.role ? user.role.toUpperCase() === "ADMIN" : false;
    const emailIsAdmin = user?.email
      ? ADMIN_EMAILS.includes(user.email.toLowerCase())
      : false;
    return roleIsAdmin || emailIsAdmin;
  }, [user?.role, user?.email]);

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

  const loadUser = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch("/api/profile/me", {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!res.ok) {
        if (res.status === 401) {
          setAuthError("Нужно войти или зарегистрироваться");
        } else {
          setAuthError("Не удалось загрузить профиль");
        }
        setUser(null);
        return;
      }

      const data = await res.json();
      if (!data?.user) {
        setAuthError("Нужно войти или зарегистрироваться");
        setUser(null);
          return;
        }

      setUser(data.user);
    } catch (err: any) {
      if (err?.name === "AbortError") {
        setAuthError("Сервер долго не отвечает. Попробуйте обновить страницу.");
      } else {
        setAuthError("Не удалось загрузить профиль");
      }
      setUser(null);
    } finally {
      clearTimeout(timer);
      setAuthLoading(false);
    }
  }, []);

  const loadReports = useCallback(
    async (nextPage = page, keepLoading = true) => {
    if (!user) return;
      if (keepLoading) setLoadingReports(true);
      setReportsError(null);

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(
          `/api/bug-reports?status=${statusFilter}&page=${nextPage}&limit=${PAGE_SIZE}`,
          { cache: "no-store", signal: controller.signal }
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
          setReportsError("Сервер долго не отвечает. Попробуйте позже.");
        } else {
          setReportsError(err?.message || "Не удалось загрузить список");
        }
        setReports([]);
        setTotalPages(1);
      } finally {
        clearTimeout(timer);
        setLoadingReports(false);
      }
    },
    [user, statusFilter, page]
  );

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!user) return;
    setPage(1);
    loadReports(1);
  }, [user, statusFilter, loadReports]);

  useEffect(() => {
    if (!user) return;
    loadReports(page);
  }, [page, user, loadReports]);

  const handleReportCreated = (newReport?: any) => {
    if (newReport) {
      const formatted = formatReport(newReport);
      setReports((prev) => [formatted, ...prev]);
      setPage(1);
    }
    loadReports(1, false);
  };

  const handleStatusUpdate = async (reportId: string, newStatus: string) => {
    if (!isAdmin) return;

    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
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
        prev.map((r) =>
          r.id === reportId ? { ...r, status: r.status } : r
        )
      );
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!isAdmin) return;
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
  };

  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <UniversalBackground />
        <div className="container-p mx-auto pt-12 pb-12 relative z-10 text-center text-[#abd1c6]">
          Проверяем доступ...
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <UniversalBackground />
        <div className="container-p mx-auto max-w-3xl relative z-10 px-4 pt-12 pb-12">
          <div className="rounded-2xl border border-[#e16162]/40 bg-[#001e1d]/40 p-6 text-center space-y-4">
            <div className="text-lg font-semibold text-[#e16162]">Нет доступа</div>
            <p className="text-[#abd1c6]">{authError}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => router.push("/?modal=auth")}
                className="px-4 py-2 rounded-lg bg-[#f9bc60] text-[#001e1d] font-semibold"
              >
                Войти/зарегистрироваться
              </button>
              <button
                onClick={loadUser}
                className="px-4 py-2 rounded-lg border border-[#abd1c6]/40 text-[#abd1c6]"
              >
                Повторить
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <UniversalBackground />

      {/* Декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-16 left-8 w-64 h-64 bg-[#e16162]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-16 right-8 w-80 h-80 bg-[#f9bc60]/5 rounded-full blur-3xl" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="container-p mx-auto max-w-7xl relative z-10 px-4 pt-8 pb-12 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56">
            <img 
              src="/kopibag.png" 
              alt="Баг-репорты" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#fffffe] via-[#abd1c6] to-[#e16162] bg-clip-text text-transparent">
            Баг-репорты
          </h1>
          <p className="text-lg text-[#abd1c6] max-w-2xl mx-auto">
            Копилка — молодой проект: баги, уязвимости или любые дыры безопасности сразу пишите сюда, мы быстро разберёмся.
          </p>
        </motion.div>

        {/* Подсказки */}
        <div className="rounded-2xl border border-[#abd1c6]/30 bg-gradient-to-br from-[#002d2b]/70 to-[#001614]/70 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f9bc60] to-[#e16162] flex items-center justify-center shadow-md">
              <LucideIcons.Lightbulb className="text-[#001e1d]" size="sm" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f9bc60]">
                Как написать полезный баг-репорт
              </div>
              <div className="text-xs text-[#abd1c6]/80">
                Коротко, по шагам и с фактами — так мы решим быстрее.
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs text-[#abd1c6]">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#f9bc60]">•</span>
                <span><span className="text-[#f9bc60]">Заголовок:</span> что именно не так.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#f9bc60]">•</span>
                <span><span className="text-[#f9bc60]">Шаги и ожидание:</span> что сделали, что хотели получить, что получили.</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#f9bc60]">•</span>
                <span><span className="text-[#f9bc60]">Доказательства:</span> скриншоты, ссылки, короткое видео.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-[#f9bc60]">•</span>
                <span><span className="text-[#f9bc60]">Безопасность:</span> опишите, как воспроизвести уязвимость (без лишних деталей наружу).</span>
              </div>
            </div>
          </div>
        </div>

        {/* Форма + список */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:sticky lg:top-6"
            >
              <BugReportForm onReportCreated={handleReportCreated} />
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-4">
              <BugReportFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
            />

            {reportsError && (
              <div className="rounded-xl border border-[#e16162]/40 bg-[#001e1d]/40 p-4 text-[#e16162] flex items-center justify-between">
                <span>{reportsError}</span>
                <button
                  onClick={() => loadReports(page)}
                  className="px-3 py-2 text-sm rounded-lg bg-[#f9bc60] text-[#001e1d] font-semibold"
                >
                  Обновить
                </button>
              </div>
            )}

              <BugReportList
                reports={reports}
                loading={loadingReports}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              isAdmin={isAdmin}
              onStatusUpdate={handleStatusUpdate}
              onDeleteReport={handleDeleteReport}
              />
          </div>
        </div>
      </div>
    </div>
  );
}

