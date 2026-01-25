"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { BugReport } from "@/app/reports/page";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import ReportDetailCard from "@/components/reports/ReportDetailCard";
import ImageModal from "@/components/reports/ImageModal";
import { useReportDetail } from "@/hooks/reports/useReportDetail";
import { useReportLike } from "@/hooks/reports/useReportLike";

export default function BugReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Проверка авторизации
  useEffect(() => {
    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push(
            buildAuthModalUrl({
              pathname: window.location.pathname,
              search: window.location.search,
              modal: "auth",
            }),
          );
          return;
        }
        setUser(d.user);
      })
      .catch(() =>
        router.push(
          buildAuthModalUrl({
            pathname: window.location.pathname,
            search: window.location.search,
            modal: "auth",
          }),
        ),
      )
      .finally(() => setLoading(false));
  }, [router]);

  const {
    report,
    loading: loadingReport,
    setReport,
  } = useReportDetail({
    reportId: params.id as string | null,
    userId: user?.id || null,
  });

  const { liking, handleLike } = useReportLike({
    report,
    setReport,
  });

  if (loading || loadingReport) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="container-p mx-auto pt-8 pb-8 relative z-10">
          <div className="text-center">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!user || !report) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#e16162]/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-[#f9bc60]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container-p mx-auto max-w-4xl relative z-10 px-4 pt-8 pb-12">
        {/* Кнопка назад */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#abd1c6] hover:text-[#fffffe] transition-colors mb-6"
        >
          <LucideIcons.ArrowLeft size="sm" />
          <span>Назад</span>
        </motion.button>

        <ReportDetailCard
          report={report}
          onLike={handleLike}
          liking={liking}
          onImageClick={setSelectedImage}
        />
      </div>

      <ImageModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
