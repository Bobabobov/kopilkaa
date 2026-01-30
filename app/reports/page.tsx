"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import BugReportForm from "@/components/reports/BugReportForm";
import BugReportList from "@/components/reports/BugReportList";
import BugReportFilters from "@/components/reports/BugReportFilters";
import ReportsHeader from "@/components/reports/ReportsHeader";
import ReportsTips from "@/components/reports/ReportsTips";
import ReportsError from "@/components/reports/ReportsError";
import ReportsAuthError from "@/components/reports/ReportsAuthError";
import { useReportsAuth } from "@/hooks/reports/useReportsAuth";
import { useReports } from "@/hooks/reports/useReports";

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

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const {
    user,
    isAdminAllowed,
    loading: authLoading,
    error: authError,
    loadUser,
  } = useReportsAuth();
  const isAdmin = useMemo(() => {
    const roleIsAdmin = user?.role
      ? user.role.toUpperCase() === "ADMIN"
      : false;
    return roleIsAdmin || isAdminAllowed;
  }, [user?.role, isAdminAllowed]);

  const {
    reports,
    loading: loadingReports,
    error: reportsError,
    totalPages,
    loadReports,
    updateStatus,
    deleteReport,
    addReport,
  } = useReports({
    userId: user?.id || null,
    statusFilter,
    page,
    isAdmin,
  });

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
      addReport(newReport);
      setPage(1);
    }
    loadReports(1, false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="container-p mx-auto pt-12 pb-12 relative z-10 text-center text-[#abd1c6]">
          Проверяем доступ...
        </div>
      </div>
    );
  }

  if (authError) {
    return <ReportsAuthError error={authError} onRetry={loadUser} />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-16 left-8 w-64 h-64 bg-[#e16162]/5 rounded-full blur-3xl"></div>
        <div
          className="absolute bottom-16 right-8 w-80 h-80 bg-[#f9bc60]/5 rounded-full blur-3xl"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container-p mx-auto max-w-7xl relative z-10 px-4 pt-8 pb-12 space-y-8">
        <ReportsHeader />
        <ReportsTips />

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
              <ReportsError
                error={reportsError}
                onRetry={() => loadReports(page)}
              />
            )}

            <BugReportList
              reports={reports}
              loading={loadingReports}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isAdmin={isAdmin}
              onStatusUpdate={updateStatus}
              onDeleteReport={deleteReport}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
