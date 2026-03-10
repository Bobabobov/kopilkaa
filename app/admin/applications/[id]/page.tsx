// app/admin/applications/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";
import ApplicationHeader from "./_components/ApplicationHeader";
import ApplicationTitle from "./_components/ApplicationTitle";
import ApplicationMetaInfo from "./_components/ApplicationMetaInfo";
import ApplicationPaymentDetails from "./_components/ApplicationPaymentDetails";
import ApplicationIpBlock from "./_components/ApplicationIpBlock";
import ApplicationImages from "./_components/ApplicationImages";
import ApplicationStory from "./_components/ApplicationStory";
import ApplicationSuspicionBlock from "./_components/ApplicationSuspicionBlock";
import ApplicationAdminComment from "./_components/ApplicationAdminComment";
import ApplicationFooter from "./_components/ApplicationFooter";
import ApplicationImageLightbox from "./_components/ApplicationImageLightbox";
import ApplicationReviewBlock from "./_components/ApplicationReviewBlock";
import ApplicationPreviousReviewBlock from "./_components/ApplicationPreviousReviewBlock";
import AdminSection from "./_components/AdminSection";
import AdminSectionNav from "./_components/AdminSectionNav";
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
    } catch {
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
    <div className="min-h-screen relative w-full min-w-0 max-w-[100vw] overflow-x-hidden box-border">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-[#f9bc60]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-[#abd1c6]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-12 px-3 sm:px-6 lg:px-8 min-w-0 w-full max-w-full box-border"
      >
        <div className="max-w-7xl mx-auto min-w-0 w-full box-border">
          <ApplicationHeader
            status={item.status}
            onBack={() => router.back()}
          />

          <AdminSectionNav />

          {/* Основной контент по секциям */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 min-w-0">
            {/* 1. Контекст заявки */}
            <AdminSection
              id="section-context"
              number={1}
              title="Контекст заявки"
              subtitle="Сумма, автор, краткое описание"
              plain
            >
              <ApplicationTitle title={item.title} />
              <div className="mt-4">
                <ApplicationMetaInfo
                  amount={item.amount}
                  userEmail={item.user.email}
                  summary={item.summary}
                  filledMs={item.filledMs}
                  onCopyEmail={handleCopyEmail}
                />
              </div>
            </AdminSection>

            {/* 2. Реквизиты */}
            <AdminSection
              id="section-payment"
              number={2}
              title="Реквизиты"
              subtitle="Банк и реквизиты для перевода, повторы"
            >
              <ApplicationPaymentDetails
                payment={item.payment}
                bankName={item.bankName || undefined}
                samePaymentApplications={item.samePaymentApplications}
                onCopyError={handleCopyError}
              />
            </AdminSection>

            {/* 3. Проверка отзыва по прошлой заявке */}
            <AdminSection
              id="section-previous-review"
              number={3}
              title="Проверка: отзыв по прошлой заявке"
              subtitle="Перед одобрением проверьте, что отзыв с доказательствами оставлен"
            >
              <ApplicationPreviousReviewBlock
                data={item.previousApprovedWithReview}
                showTitle={false}
              />
            </AdminSection>

            {/* 4. IP и повторы */}
            <AdminSection
              id="section-tech"
              number={4}
              title="IP и повторы"
              subtitle="Адрес при подаче, другие заявки с этого IP"
            >
              <ApplicationIpBlock
                submitterIp={item.submitterIp}
                sameIpApplications={item.sameIpApplications}
              />
            </AdminSection>

            {/* 5. Фото */}
            <AdminSection
              id="section-images"
              number={5}
              title="Фотографии заявки"
              subtitle={`Приложено фото: ${item.images.length}`}
            >
              <ApplicationImages
                images={item.images}
                onImageClick={handleImageClick}
                showTitle={false}
              />
            </AdminSection>

            {/* 6. История и подозрения */}
            <AdminSection
              id="section-story"
              number={6}
              title="История и проверка на подозрения"
              subtitle="Текст от пользователя, время заполнения"
            >
              <ApplicationSuspicionBlock
                story={item.story}
                filledMs={item.filledMs}
                storyEditMs={item.storyEditMs}
              />
              <div className="mt-6">
                <ApplicationStory story={item.story} />
              </div>
            </AdminSection>

            {/* 7. Отзыв */}
            <AdminSection
              id="section-review"
              number={7}
              title="Отзыв"
              subtitle={
                item.review
                  ? "Оставлен после одобрения"
                  : item.status === "APPROVED"
                    ? "Пока не оставлен"
                    : "Доступен после одобрения"
              }
            >
              {item.review ? (
                <ApplicationReviewBlock review={item.review} />
              ) : (
                <div
                  className="rounded-xl p-4 border border-dashed"
                  style={{
                    borderColor: "rgba(171, 209, 198, 0.3)",
                    color: "#94a1b2",
                  }}
                >
                  <span className="text-sm">
                    {item.status === "APPROVED"
                      ? "Отзыв пока не оставлен."
                      : "Отзыв оставляется после одобрения заявки."}
                  </span>
                </div>
              )}
            </AdminSection>

            {/* 8. Действия */}
            <AdminSection
              id="section-actions"
              number={8}
              title="Действия"
              subtitle="Комментарий, ссылки, удаление"
            >
              {item.adminComment && (
                <div className="mb-6">
                  <ApplicationAdminComment comment={item.adminComment} />
                </div>
              )}
              <ApplicationFooter
                createdAt={item.createdAt}
                status={item.status}
                applicationId={item.id}
                onDelete={deleteApplication}
              />
            </AdminSection>
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
