// app/admin/applications/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";
import ApplicationHeader from "./components/ApplicationHeader";
import ApplicationTitle from "./components/ApplicationTitle";
import ApplicationMetaInfo from "./components/ApplicationMetaInfo";
import ApplicationPaymentDetails from "./components/ApplicationPaymentDetails";
import ApplicationImages from "./components/ApplicationImages";
import ApplicationStory from "./components/ApplicationStory";
import ApplicationAdminComment from "./components/ApplicationAdminComment";
import ApplicationFooter from "./components/ApplicationFooter";
import ApplicationImageLightbox from "./components/ApplicationImageLightbox";
import type { ApplicationItem } from "./types";

export default function AdminApplicationPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;
  const [item, setItem] = useState<ApplicationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const { showToast, ToastComponent } = useBeautifulToast();

  const deleteApplication = async () => {
    try {
      const r = await fetch(`/api/admin/applications/${item?.id}`, {
        method: "DELETE",
      });
      if (r.ok) {
        showToast("success", "Заявка удалена", "Заявка была успешно удалена");
        router.push("/admin");
      } else {
        showToast("error", "Ошибка удаления", "Не удалось удалить заявку");
      }
    } catch (error) {
      showToast(
        "error",
        "Ошибка удаления",
        "Произошла ошибка при удалении заявки",
      );
    }
  };

  useEffect(() => {
    fetch(`/api/admin/applications/${id}`, { cache: "no-store" })
      .then(async (r) => {
        if (r.status === 403) {
          router.push("/");
          return;
        }
        const d = await r.json();
        if (r.ok && d?.item) {
          setItem(d.item);
        } else {
          setErr(d?.error || "Не найдено");
        }
      })
      .catch(() => setErr("Ошибка загрузки"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleImageClick = (index: number) => {
    setLbIndex(index);
    setLbOpen(true);
  };

  const handleLightboxPrevious = () => {
    if (!item) return;
    setLbIndex((i) => (i - 1 + item.images.length) % item.images.length);
  };

  const handleLightboxNext = () => {
    if (!item) return;
    setLbIndex((i) => (i + 1) % item.images.length);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard
      .writeText(email)
      .then(() => {
        showToast(
          "success",
          "Email скопирован!",
          "Адрес автора добавлен в буфер обмена",
        );
      })
      .catch(() => {
        prompt("Email автора:", email);
      });
  };

  const handleCopyError = (message: string) => {
    showToast("error", "Ошибка копирования", message);
  };

  useEffect(() => {
    if (!lbOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOpen(false);
      if (e.key === "ArrowLeft") handleLightboxPrevious();
      if (e.key === "ArrowRight") handleLightboxNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lbOpen, item?.images.length]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <UniversalBackground />
        <div className="relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-12 h-12 border-4 border-[#f9bc60] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p style={{ color: "#abd1c6" }}>Загрузка...</p>
          </motion.div>
        </div>
      </div>
    );

  if (err)
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        <UniversalBackground />
        <div className="relative z-10">
          <motion.div 
            className="text-center max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ color: "#e16162" }}
          >
            {err}
          </motion.div>
        </div>
      </div>
    );

  if (!item) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#f9bc60]/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#abd1c6]/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <ApplicationHeader status={item.status} onBack={() => router.back()} />

          {/* Основной контент */}
          <div className="grid gap-6 lg:gap-8">
            <ApplicationTitle title={item.title} />

            <ApplicationMetaInfo
              amount={item.amount}
              userEmail={item.user.email}
              summary={item.summary}
              filledMs={item.filledMs}
              onCopyEmail={handleCopyEmail}
            />

            <ApplicationPaymentDetails
              payment={item.payment}
              onCopyError={handleCopyError}
            />

            <ApplicationImages
              images={item.images}
              onImageClick={handleImageClick}
            />

            <ApplicationStory story={item.story} />

            {item.adminComment && (
              <ApplicationAdminComment comment={item.adminComment} />
            )}

            <ApplicationFooter
              createdAt={item.createdAt}
              status={item.status}
              applicationId={item.id}
              onDelete={deleteApplication}
            />
          </div>
        </div>
      </motion.div>

      {/* Лайтбокс */}
      <ApplicationImageLightbox
        isOpen={lbOpen}
        images={item.images}
        currentIndex={lbIndex}
        onClose={() => setLbOpen(false)}
        onPrevious={handleLightboxPrevious}
        onNext={handleLightboxNext}
      />

      {/* Красивый Toast */}
      <ToastComponent />
    </div>
  );
}
