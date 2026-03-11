// app/admin/applications/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import UniversalBackground from "@/components/ui/UniversalBackground";
import { checkApplicationSuspicion } from "@/lib/applications/suspicionCheck";
import { statusRu } from "@/lib/status";
import ApplicationHeader from "./_components/ApplicationHeader";
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
import type { ApplicationItem, ApplicationStatus } from "./types";

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
  const [decreaseOnDecision, setDecreaseOnDecision] = useState(false);
  const [countTowardsTrust, setCountTowardsTrust] = useState<boolean | null>(
    null,
  );
  const [editStatus, setEditStatus] = useState<ApplicationStatus>("PENDING");
  const [editComment, setEditComment] = useState("");
  const [editPublishInStories, setEditPublishInStories] = useState(false);

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
          setCountTowardsTrust(
            d.item.countTowardsTrust !== undefined
              ? Boolean(d.item.countTowardsTrust)
              : true,
          );
          setEditStatus(d.item.status);
          setEditComment(d.item.adminComment || "");
          setEditPublishInStories(Boolean(d.item.publishInStories));
          setDecreaseOnDecision(Boolean(d.item.trustDecreasedAtDecision));
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

  const hasReview = Boolean(item.review);
  const suspicion = checkApplicationSuspicion(
    item.story,
    item.filledMs,
    item.storyEditMs,
  );
  const riskLabel = !suspicion.hasSuspicion
    ? "Риск: низкий"
    : suspicion.fastFillHigh
      ? "Риск: высокий"
      : "Риск: повышенное внимание";
  const riskTone =
    !suspicion.hasSuspicion || (!suspicion.fastFillHigh && !suspicion.fastFill)
      ? "low"
      : suspicion.fastFillHigh
        ? "high"
        : "medium";
  const actionsSectionNumber = hasReview ? 8 : 7;

  const quickUpdateStatus = async (newStatus: ApplicationStatus) => {
    if (!item) return;
    try {
      const response = await fetch(`/api/admin/applications/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminComment: item.adminComment || "",
          decreaseTrustOnDecision: Boolean(decreaseOnDecision),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json().catch(() => null)) as {
        item?: ApplicationItem | null;
      } | null;
      const updated = data?.item;
      setItem((prev) =>
        prev
          ? {
              ...prev,
              status: updated?.status ?? newStatus,
              adminComment: updated?.adminComment ?? prev.adminComment,
            }
          : prev,
      );
      setEditStatus(updated?.status ?? newStatus);
      setEditComment(updated?.adminComment ?? editComment);
      showToast(
        "success",
        `Заявка ${newStatus === "APPROVED" ? "одобрена" : "отклонена"}!`,
      );
      setDecreaseOnDecision(false);
    } catch (error) {
      console.error("Failed to update application status", error);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  const handleToggleTrust = async (next: boolean) => {
    if (!item) return;
    setCountTowardsTrust(next);
    try {
      const response = await fetch(
        `/api/admin/applications/${item.id}/trust`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ countTowardsTrust: next }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      showToast("success", "Флаг доверия обновлён");
    } catch (error) {
      console.error("Failed to update trust flag", error);
      setCountTowardsTrust((prev) => (prev === null ? null : !prev));
      showToast("error", "Ошибка обновления флага доверия");
    }
  };
  const handleSaveFullStatus = async () => {
    if (!item) return;
    try {
      const response = await fetch(`/api/admin/applications/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminComment: editComment,
          decreaseTrustOnDecision: Boolean(decreaseOnDecision),
          publishInStories:
            editStatus === "CONTEST" ? editPublishInStories : false,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json().catch(() => null);
      const updated = data?.item;
      setItem((prev) =>
        prev && updated && prev.id === updated.id
          ? {
              ...prev,
              status: updated.status,
              adminComment: updated.adminComment,
              publishInStories: updated.publishInStories,
              trustDecreasedAtDecision: updated.trustDecreasedAtDecision,
            }
          : prev,
      );
      setEditStatus(updated?.status ?? editStatus);
      setEditComment(updated?.adminComment ?? editComment);
      setEditPublishInStories(
        updated?.publishInStories ?? editPublishInStories,
      );
      showToast("success", "Статус заявки обновлен!");
    } catch (error) {
      console.error("Failed to update application via form", error);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  return (
    <div className="relative min-h-screen w-full min-w-0 max-w-[100vw] overflow-x-hidden box-border">
      <UniversalBackground />

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

          {/* Быстрый обзор заявки */}
          <div className="mb-4 sm:mb-6 lg:mb-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_22px_60px_rgba(0,0,0,0.55)] px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 sm:max-w-[55%]">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-[#abd1c6]/70 mb-1">
                  Заявка
                </p>
                <h1 className="text-base sm:text-lg lg:text-xl font-black text-[#fffffe] leading-tight line-clamp-2">
                  {item.title}
                </h1>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-[#94a1b2]">
                  <span>
                    ID:{" "}
                    <span className="font-mono">{item.id.slice(0, 10)}…</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 border border-white/15 text-[10px] font-semibold text-[#e5e7eb] bg-black/10">
                    <LucideIcons.Flag size="xs" />
                    {statusRu[item.status]}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 border text-[10px] font-semibold ${
                      riskTone === "low"
                        ? "border-emerald-400/60 text-emerald-300 bg-emerald-400/10"
                        : riskTone === "high"
                          ? "border-red-400/70 text-red-200 bg-red-500/10"
                          : "border-amber-300/70 text-amber-200 bg-amber-400/10"
                    }`}
                  >
                    <LucideIcons.AlertTriangle size="xs" />
                    {riskLabel}
                  </span>
                </p>
                <p className="mt-1 text-[11px] sm:text-xs text-[#94a1b2] line-clamp-1">
                  {item.summary || "Без краткого описания"}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 min-w-0 w-full sm:max-w-[45%]">
                <div className="rounded-2xl border border-[#f9bc60]/30 bg-gradient-to-br from-[#f9bc60]/15 to-transparent px-3 py-2 sm:px-3.5 sm:py-2.5 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[#f9bc60]/90">
                    <LucideIcons.Coins size="xs" />
                    Сумма
                  </div>
                  <div className="mt-0.5 text-sm sm:text-base font-black text-[#fffffe]">
                    ₽{item.amount.toLocaleString("ru-RU")}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 px-3 py-2 sm:px-3.5 sm:py-2.5 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]/80">
                    <LucideIcons.Calendar size="xs" />
                    Создана
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#fffffe]">
                    {new Date(item.createdAt).toLocaleString("ru-RU")}
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/12 bg-white/5 px-3 py-2 sm:px-3.5 sm:py-2.5 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]/80">
                    <LucideIcons.MessageCircle size="xs" />
                    Отзыв и фото
                  </div>
                  <div className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#fffffe] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>
                      {hasReview
                        ? "Отзыв есть"
                        : item.status === "APPROVED"
                          ? "Ждём отзыв"
                          : "После одобрения"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[#abd1c6]/85">
                      <LucideIcons.Image size="xs" />
                      {item.images.length || 0}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 rounded-2xl border border-white/10 bg-black/10 px-3 py-2 sm:px-3.5 sm:py-2.5 flex flex-col justify-between min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-[#abd1c6]/80">
                    <LucideIcons.Activity size="xs" />
                    Повторы
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] sm:text-xs text-[#e5e7eb]">
                    <span>
                      IP:{" "}
                      <span className="font-semibold">
                        {(item.sameIpApplications?.length ?? 0) || 0}
                      </span>
                    </span>
                    <span>
                      Реквизиты:{" "}
                      <span className="font-semibold">
                        {(item.samePaymentApplications?.length ?? 0) || 0}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Основной контент по секциям */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10 min-w-0">
            {/* 1. Контекст заявки */}
            <AdminSection
              id="section-context"
              number={1}
              title="Контекст заявки"
              subtitle="Краткий портрет заявки: сумма, автор, описание и скорость заполнения"
            >
              <ApplicationMetaInfo
                amount={item.amount}
                userEmail={item.user.email}
                summary={item.summary}
                filledMs={item.filledMs}
                onCopyEmail={handleCopyEmail}
              />
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

            {/* 3. Проверка отчёта по прошлой заявке */}
            <AdminSection
              id="section-previous-review"
              number={3}
              title="Проверка: отчёт по прошлой заявке"
              subtitle="Перед одобрением проверьте, что отчёт с фото-доказательствами оставлен"
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

            {/* 7. Отзыв — показываем только если он реально есть */}
            {hasReview && (
              <AdminSection
                id="section-review"
                number={7}
                title="Отзыв"
                subtitle="Оставлен после одобрения"
              >
                <ApplicationReviewBlock review={item.review} />
              </AdminSection>
            )}

            {/* 7 или 8. Действия */}
            <AdminSection
              id="section-actions"
              number={actionsSectionNumber}
              title="Действия"
              subtitle="Комментарий, ссылки, удаление"
            >
              {/* Панель быстрых действий как в списке заявок */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full min-w-0 mb-4">
                <div className="flex flex-wrap gap-2 w-full min-w-0">
                  <button
                    className="group min-h-[42px] px-3 py-2 sm:py-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation"
                    type="button"
                    onClick={() => quickUpdateStatus("APPROVED")}
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="hidden sm:inline">Одобрить</span>
                  </button>

                  <button
                    className="group min-h-[42px] px-3 py-2 sm:py-2 bg-gradient-to-r from-[#e16162] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white rounded-xl transition-all duration-200 font-bold shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm touch-manipulation"
                    type="button"
                    onClick={() => quickUpdateStatus("REJECTED")}
                  >
                    <svg
                      className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="hidden sm:inline">Отказать</span>
                  </button>

                  {countTowardsTrust !== null && (
                    <button
                      type="button"
                      onClick={() => handleToggleTrust(!countTowardsTrust)}
                      className={[
                        "min-h-[42px] px-3 py-2 sm:py-2 rounded-xl border text-xs font-semibold transition-all duration-200 touch-manipulation",
                        "flex items-center justify-center gap-2",
                        countTowardsTrust
                          ? "bg-[#10B981]/12 text-[#fffffe] border-[#10B981]/35 hover:border-[#10B981]/55"
                          : "bg-white/5 text-[#abd1c6] border-white/10 hover:border-[#f9bc60]/30 hover:bg-white/10",
                      ].join(" ")}
                      title="Учитывать ли эту заявку при подсчёте доверия"
                    >
                      <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10">
                        <span
                          className={[
                            "absolute h-4 w-4 rounded-full transition-transform",
                            countTowardsTrust
                              ? "translate-x-[18px] bg-[#10B981]"
                              : "translate-x-[2px] bg-[#abd1c6]/60",
                          ].join(" ")}
                        />
                      </span>
                      <span className="whitespace-nowrap">
                        Засчитывать для доверия
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setDecreaseOnDecision((v) => !v)}
                    className={[
                      "min-h-[42px] px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 touch-manipulation",
                      "flex items-center justify-center gap-2",
                      decreaseOnDecision
                        ? "bg-[#e16162]/12 text-[#fffffe] border-[#e16162]/35 hover:border-[#e16162]/55"
                        : "bg-white/5 text-[#abd1c6] border-white/10 hover:border-[#e16162]/30 hover:bg-white/10",
                    ].join(" ")}
                    title="При решении по заявке понизить уровень доверия на 1"
                  >
                    <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10">
                      <span
                        className={[
                          "absolute h-4 w-4 rounded-full transition-transform",
                          decreaseOnDecision
                            ? "translate-x-[18px] bg-[#e16162]"
                            : "translate-x-[2px] bg-[#abd1c6]/60",
                        ].join(" ")}
                      />
                    </span>
                    <span className="whitespace-nowrap">
                      Понизить уровень на 1
                    </span>
                  </button>
                </div>
              </div>

              {item.adminComment && (
                <div className="mb-6">
                  <ApplicationAdminComment comment={item.adminComment} />
                </div>
              )}

              {/* Расширенная форма статуса и комментария (аналог модалки) */}
              <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-1.5 sm:mb-2">
                    Новый статус
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-transparent border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/45 focus:border-[#f9bc60]/30 transition-all duration-200 text-[#fffffe] outline-none text-sm"
                    value={editStatus}
                    onChange={(e) => {
                      const next = e.target.value as ApplicationStatus;
                      setEditStatus(next);
                      if (next !== "CONTEST") {
                        setEditPublishInStories(false);
                      }
                    }}
                  >
                    <option value="PENDING">⏳ В обработке</option>
                    <option value="APPROVED">✅ Одобрено</option>
                    <option value="REJECTED">❌ Отказано</option>
                    <option value="CONTEST">🏆 Конкурс</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#abd1c6] mb-1.5 sm:mb-2">
                    Комментарий администратора
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 bg-transparent border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#f9bc60]/45 focus:border-[#f9bc60]/30 transition-all duration-200 text-[#fffffe] placeholder:text-[#abd1c6]/60 min-h-[90px] resize-none outline-none text-sm"
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    placeholder="Причина решения / уточнения для автора..."
                  />
                  <p className="mt-1 text-[11px] text-[#abd1c6]">
                    Этот комментарий увидит пользователь в уведомлении и в модальном окне.
                  </p>
                </div>

                {editStatus === "CONTEST" && (
                  <button
                    type="button"
                    onClick={() =>
                      setEditPublishInStories((prev) => !prev)
                    }
                    className="w-full flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex w-9 h-9 rounded-xl bg-[#f9bc60]/12 border border-[#f9bc60]/25 items-center justify-center flex-shrink-0">
                        <LucideIcons.Trophy size="sm" className="text-[#f9bc60]" />
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-semibold text-[#fffffe]">
                          Публиковать в /stories
                        </p>
                        <p className="text-xs text-[#abd1c6]">
                          Отметить как победителя конкурса
                        </p>
                      </div>
                    </div>
                    <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-white/10 flex-shrink-0">
                      <span
                        className={[
                          "absolute h-4 w-4 rounded-full transition-transform",
                          editPublishInStories
                            ? "translate-x-[18px] bg-[#10B981]"
                            : "translate-x-[2px] bg-[#abd1c6]/60",
                        ].join(" ")}
                      />
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSaveFullStatus}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#f9bc60] hover:bg-[#e8a545] text-[#0f2d2a] rounded-2xl transition-colors font-bold shadow-lg hover:shadow-[#f9bc60]/20 text-sm"
                >
                  Сохранить изменения
                </button>
              </div>

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
