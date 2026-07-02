// app/admin/applications/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useBeautifulToast } from "@/components/ui/BeautifulToast";
import { checkApplicationSuspicion } from "@/lib/applications/suspicionCheck";
import {
  getApplicationCategoryLabel,
  isApplicationCategory,
} from "@/lib/applications/categories";
import { statusRu } from "@/lib/status";
import ApplicationHeader from "./_components/ApplicationHeader";
import ApplicationMetaInfo from "./_components/ApplicationMetaInfo";
import ApplicationPaymentDetails from "./_components/ApplicationPaymentDetails";
import ApplicationIpBlock from "./_components/ApplicationIpBlock";
import ApplicationDeviceBlock from "./_components/ApplicationDeviceBlock";
import ApplicationImages from "./_components/ApplicationImages";
import ApplicationStory from "./_components/ApplicationStory";
import ApplicationSuspicionBlock from "./_components/ApplicationSuspicionBlock";
import { StoryLightbox } from "@/components/stories/StoryLightbox";
import ApplicationReviewBlock from "./_components/ApplicationReviewBlock";
import ApplicationPreviousReviewBlock from "./_components/ApplicationPreviousReviewBlock";
import { ApplicationEconomyAdminBlock } from "./_components/ApplicationEconomyBlock";
import AdminSectionNav from "./_components/AdminSectionNav";
import {
  AdminCollapsiblePanel,
  AdminRiskBadge,
} from "./_components/AdminCollapsiblePanel";
import { AdminDecisionPanel } from "./_components/AdminDecisionPanel";
import { collectLinkedAccountsFromRefs } from "@/lib/admin/buildMultiAccountRejectComment";
import { countOtherUserApplicationRefs } from "@/lib/admin/filterOtherUserApplicationRefs";
import type { ApplicationItem, ApplicationStatus } from "./types";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";

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
  const { showToast } = useBeautifulToast();
  const [editStatus, setEditStatus] = useState<ApplicationStatus>("PENDING");
  const [editComment, setEditComment] = useState("");

  const deleteApplication = async () => {
    try {
      const r = await fetch(`/api/admin/applications/${item?.id}`, {
        method: "DELETE",
      });
      if (r.ok) {
        showToast("success", "Заявка удалена", "Заявка была успешно удалена");
        router.push("/admin/applications");
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
          setEditStatus(d.item.status);
          setEditComment(d.item.adminComment || "");
        } else {
          setErr(getMessageFromApiJson(d, "Заявка не найдена"));
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

  if (loading)
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f9bc60] border-t-transparent" />
          <p className="text-[#abd1c6]">Загрузка...</p>
        </motion.div>
      </div>
    );

  if (err)
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <motion.div
          className="max-w-4xl text-center text-[#e16162]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {err}
        </motion.div>
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

  const linkedIpCount = countOtherUserApplicationRefs(
    item.sameIpApplications,
    item.user.id,
  );
  const linkedPaymentCount = countOtherUserApplicationRefs(
    item.samePaymentApplications,
    item.user.id,
  );
  const linkedDeviceCount = countOtherUserApplicationRefs(
    item.sameDeviceApplications,
    item.user.id,
  );

  const totalLinkedCount =
    linkedIpCount + linkedPaymentCount + linkedDeviceCount;
  const previousReviewMissing = Boolean(
    item.previousApprovedWithReview && !item.previousApprovedWithReview.review,
  );

  const categoryLabel =
    item.category && isApplicationCategory(item.category)
      ? getApplicationCategoryLabel(item.category)
      : null;

  const linkedAccounts = collectLinkedAccountsFromRefs(
    item.sameIpApplications ?? [],
    item.samePaymentApplications ?? [],
    item.user.id,
  );

  const quickUpdateStatus = async (newStatus: ApplicationStatus) => {
    if (!item) return;

    try {
      const response = await fetch(`/api/admin/applications/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminComment: item.adminComment || "",
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
    } catch (error) {
      console.error("Failed to update application status", error);
      showToast("error", "Ошибка обновления заявки");
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
            }
          : prev,
      );
      setEditStatus(updated?.status ?? editStatus);
      setEditComment(updated?.adminComment ?? editComment);
      showToast("success", "Статус заявки обновлен!");
    } catch (error) {
      console.error("Failed to update application via form", error);
      showToast("error", "Ошибка обновления заявки");
    }
  };

  return (
    <div className="relative min-w-0 w-full max-w-7xl mx-auto overflow-x-hidden box-border">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 pb-6 sm:pb-8 min-w-0 w-full max-w-full box-border"
      >
          <ApplicationHeader onBack={() => router.back()} />

          {/* Шапка: только главное */}
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 sm:px-5 sm:py-4">
            <h1 className="text-lg sm:text-xl font-black text-[#fffffe] leading-tight">
              {item.title}
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="rounded-full border border-white/15 bg-black/10 px-2 py-0.5 font-semibold text-[#e5e7eb]">
                {statusRu[item.status]}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 font-semibold text-[11px] sm:text-xs ${
                  riskTone === "low"
                    ? "border-emerald-400/50 text-emerald-300"
                    : riskTone === "high"
                      ? "border-red-400/60 text-red-200"
                      : "border-amber-300/60 text-amber-200"
                }`}
              >
                {riskLabel}
              </span>
              <span className="font-bold text-[#f9bc60]">
                ₽{item.amount.toLocaleString("ru-RU")}
              </span>
              {totalLinkedCount > 0 ? (
                <span className="text-amber-200/90">
                  Связей: {totalLinkedCount}
                </span>
              ) : (
                <span className="text-[#94a1b2]">Связей нет</span>
              )}
            </p>
            {item.summary ? (
              <p className="mt-2 text-sm text-[#abd1c6]/90 line-clamp-2">
                {item.summary}
              </p>
            ) : null}
          </div>

          <AdminSectionNav />

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_min(360px,34%)] gap-6 xl:gap-8 items-start min-w-0">
            {/* Левая колонка: связи + заявка */}
            <div className="space-y-6 sm:space-y-8 min-w-0 order-1">
              <section id="section-risks" className="scroll-mt-28 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#fffffe] mb-3">
                  1. Связи и риски
                </h2>
                <div className="space-y-2">
                  <AdminCollapsiblePanel
                    title="Реквизиты"
                    badge={<AdminRiskBadge count={linkedPaymentCount} />}
                    defaultOpen={linkedPaymentCount > 0}
                  >
                    <ApplicationPaymentDetails
                      payment={item.payment}
                      bankName={item.bankName || undefined}
                      samePaymentApplications={item.samePaymentApplications}
                      onCopyError={handleCopyError}
                      mode="repeats"
                    />
                  </AdminCollapsiblePanel>

                  <AdminCollapsiblePanel
                    title="IP-адрес"
                    badge={<AdminRiskBadge count={linkedIpCount} />}
                    defaultOpen={linkedIpCount > 0}
                  >
                    <ApplicationIpBlock
                      submitterIp={item.submitterIp}
                      sameIpApplications={item.sameIpApplications}
                    />
                  </AdminCollapsiblePanel>

                  <AdminCollapsiblePanel
                    title="Устройство"
                    badge={<AdminRiskBadge count={linkedDeviceCount} />}
                    defaultOpen={linkedDeviceCount > 0}
                  >
                    <ApplicationDeviceBlock
                      deviceFingerprint={item.deviceFingerprint}
                      clientDevice={item.clientDevice}
                      sameDeviceApplications={item.sameDeviceApplications}
                      currentUserId={item.user.id}
                    />
                  </AdminCollapsiblePanel>

                  <AdminCollapsiblePanel
                    title="Отзыв по прошлой заявке"
                    badge={
                      item.previousApprovedWithReview ? (
                        item.previousApprovedWithReview.review ? (
                          <span className="text-[11px] font-semibold text-emerald-300">
                            Есть
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-200">
                            Нет отзыва
                          </span>
                        )
                      ) : (
                        <span className="text-[11px] text-[#94a1b2]">
                          Первая заявка
                        </span>
                      )
                    }
                    defaultOpen={previousReviewMissing}
                  >
                    <ApplicationPreviousReviewBlock
                      data={item.previousApprovedWithReview}
                      showTitle={false}
                    />
                  </AdminCollapsiblePanel>
                </div>
              </section>

              <section id="section-application" className="scroll-mt-28 min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-[#fffffe] mb-4">
                  2. Заявка
                </h2>

                <div className="rounded-2xl border border-[#abd1c6]/25 bg-[#004643]/40 p-3 sm:p-5 mb-4">
                  <ApplicationMetaInfo
                    amount={item.amount}
                    desiredAmount={item.desiredAmount}
                    userId={item.user.id}
                    userName={item.user.name}
                    userAvatar={item.user.avatar}
                    userEmail={item.user.email}
                    summary={item.summary}
                    filledMs={item.filledMs}
                    categoryLabel={categoryLabel}
                    onCopyEmail={handleCopyEmail}
                    compact
                  />
                  {item.economy ? (
                    <ApplicationEconomyAdminBlock
                      economy={item.economy}
                      className="mt-4"
                    />
                  ) : null}
                </div>

                <ApplicationSuspicionBlock
                  story={item.story}
                  filledMs={item.filledMs}
                  storyEditMs={item.storyEditMs}
                />
                <div className="mt-4 mb-6">
                  <ApplicationStory story={item.story} />
                </div>

                <ApplicationImages
                  images={item.images}
                  onImageClick={handleImageClick}
                  showTitle
                />

                {hasReview && item.review ? (
                  <div className="mt-6">
                    <ApplicationReviewBlock review={item.review} />
                  </div>
                ) : null}
              </section>
            </div>

            {/* Правая колонка: решение (на мобиле — внизу) */}
            <div
              id="section-actions"
              className="order-2 scroll-mt-28 xl:sticky xl:top-24 min-w-0"
            >
              <AdminDecisionPanel
                payment={item.payment}
                bankName={item.bankName || undefined}
                status={item.status}
                editStatus={editStatus}
                editComment={editComment}
                adminComment={item.adminComment}
                createdAt={item.createdAt}
                clientTimezone={item.clientTimezone}
                applicationId={item.id}
                linkedAccounts={linkedAccounts}
                onCopyError={handleCopyError}
                onEditStatus={setEditStatus}
                onEditComment={setEditComment}
                onQuickApprove={() => quickUpdateStatus("APPROVED")}
                onQuickReject={() => quickUpdateStatus("REJECTED")}
                onSave={handleSaveFullStatus}
                onDelete={deleteApplication}
              />
            </div>
          </div>
      </motion.div>

      {/* Лайтбокс */}
      <StoryLightbox
        isOpen={lbOpen}
        images={item.images}
        currentIndex={lbIndex}
        onClose={() => setLbOpen(false)}
        onPrevious={handleLightboxPrevious}
        onNext={handleLightboxNext}
        onSelectIndex={setLbIndex}
      />

      {/* Красивый Toast */}
    </div>
  );
}
