"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { usePageTimeTracking } from "@/hooks/ui/usePageTimeTracking";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TrustHowItWorksModal from "@/components/applications/TrustHowItWorksModal";
import ApplicationsForm from "@/components/applications/ApplicationsForm";
import {
  useApplicationFormState,
  LIMITS,
} from "@/hooks/applications/useApplicationFormState";
import TrustIntroModal from "@/components/applications/TrustIntroModal";
import ActivityRequirementModal from "@/components/applications/ActivityRequirementModal";
import SuccessScreen from "@/components/applications/SuccessScreen";
import PageHeader from "@/components/applications/PageHeader";

function applicantLabelFromUser(user: {
  name?: string | null;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
}) {
  const displayName =
    user.name?.trim() ||
    user.username?.trim() ||
    (user.email ? user.email.split("@")[0]?.trim() : "") ||
    "Участник";
  return {
    applicantDisplayName: displayName,
    applicantAvatarUrl: user.avatar ?? null,
  };
}

export default function ApplicationsPageClient() {
  usePageTimeTracking({
    page: "/applications",
    enabled: true,
    sendInterval: 30000,
  });

  const state = useApplicationFormState();
  const {
    user,
    loadingAuth,
    category,
    setCategory,
    title,
    setTitle,
    summary,
    setSummary,
    story,
    setStory,
    amountFormatted,
    handleAmountInputChange,
    payment,
    setPayment,
    bankName,
    setBankName,
    photos,
    setPhotos,
    reportPhotos,
    setReportPhotos,
    uploading,
    submitting,
    err,
    left,
    submitted,
    trustAcknowledged,
    trustAck1,
    setTrustAck1,
    trustAck2,
    setTrustAck2,
    trustAck3,
    setTrustAck3,
    policiesAccepted,
    setPoliciesAccepted,
    ackError,
    introOpen,
    setIntroOpen,
    introChecked,
    setIntroChecked,
    trustLimits,
    trustLevel,
    trustHint,
    amountInputRef,
    hpCompany,
    setHpCompany,
    valid,
    exceedsTrustLimit,
    fieldErrors,
    firstErrorKey,
    validationScrollTrigger,
    validateSubmit,
    executeSubmit,
    setSubmitted,
    requiresReview,
    approvedCount,
    activityModal,
    setActivityModal,
  } = state;

  const [trustInfoOpen, setTrustInfoOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  if (loadingAuth) {
    return (
      <div
        className="min-h-screen relative flex items-center justify-center px-4"
        data-applications-mobile-opt="1"
      >
        <div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <div>
          <Card
            variant="darkGlass"
            padding="lg"
            className="max-w-md text-center"
          >
            <CardContent>
              <div
                className="flex items-center justify-center gap-2 text-[#abd1c6]"
                role="status"
                aria-live="polite"
                aria-busy="true"
              >
                <LucideIcons.Loader2 className="h-5 w-5 animate-spin text-[#f9bc60]" />
                <span>Проверка авторизации...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="min-h-screen relative flex items-center justify-center px-4 py-12"
        data-applications-mobile-opt="1"
      >
        <div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <div className="w-full max-w-lg">
          <Card variant="darkGlass" padding="lg" className="text-center">
            <div className="mb-6 flex justify-center" aria-hidden>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f9bc60]/15 border border-[#f9bc60]/30">
                <LucideIcons.User className="w-7 h-7 text-[#f9bc60]" />
              </div>
            </div>
            <div role="status" aria-live="polite">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#fffffe] mb-3">
                Войдите, чтобы подать заявку
              </h1>
              <p className="text-[#abd1c6] mb-6 leading-relaxed">
                Окно входа или регистрации должно открыться автоматически. Если
                этого не произошло — обновите страницу.
              </p>
              <p className="text-sm text-[#94a1b2]">
                После входа вы вернётесь на эту страницу и сможете заполнить
                заявку.
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen relative overflow-hidden"
        data-applications-mobile-opt="1"
      >
        <div
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="hidden sm:block absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      data-applications-mobile-opt="1"
    >
      <div
        className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>
      <TrustIntroModal
        open={introOpen}
        checked={introChecked}
        onCheckedChange={setIntroChecked}
        onConfirm={() => {
          setIntroOpen(false);
        }}
      />

      <TrustHowItWorksModal
        open={trustInfoOpen}
        onClose={() => setTrustInfoOpen(false)}
      />

      {activityModal.activityType && (
        <ActivityRequirementModal
          isOpen={activityModal.isOpen}
          onClose={() =>
            setActivityModal({
              isOpen: false,
              activityType: null,
              message: "",
            })
          }
          activityType={activityModal.activityType}
          message={activityModal.message}
        />
      )}

      <PageHeader />

      <div
        className={cn(
          "container-p mx-auto max-w-xl lg:max-w-5xl xl:max-w-6xl relative z-10 px-3 sm:px-4",
          introOpen ? "pointer-events-none select-none opacity-60" : "",
        )}
      >
        <div className="flex justify-center mb-5">
          <motion.button
            type="button"
            onClick={() => setTrustInfoOpen(true)}
            whileHover={
              reducedMotion
                ? undefined
                : { scale: 1.05, boxShadow: "0 0 24px rgba(249,188,96,0.2)" }
            }
            whileTap={reducedMotion ? undefined : { scale: 0.97 }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
              "border border-[#f9bc60]/40 bg-[#f9bc60]/10 text-[#f9bc60]",
              "hover:bg-[#f9bc60]/18",
            )}
          >
            <motion.span
              className="inline-flex"
              animate={
                reducedMotion
                  ? undefined
                  : { rotate: [0, 12, -8, 0] }
              }
              transition={{
                duration: 4.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatDelay: 5,
              }}
            >
              <LucideIcons.Sparkles size="xs" className="text-[#f9bc60]" />
            </motion.span>
            Как это работает?
          </motion.button>
        </div>

        <div className="space-y-6">
          {approvedCount !== null && approvedCount >= 1 && requiresReview && (
            <Card
              variant="darkGlass"
              padding="lg"
              className="relative overflow-hidden mb-6"
            >
              <div
                className="absolute top-0 right-0 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full pointer-events-none"
                aria-hidden
              />
              <CardContent className="relative flex items-start gap-4 p-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)",
                  }}
                >
                  <LucideIcons.MessageCircle size="sm" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-[#fffffe]">
                    Отзыв после первой заявки
                  </h2>
                  <p className="text-sm sm:text-base text-[#abd1c6] leading-relaxed">
                    После первой одобренной заявки нужно один раз оставить отзыв
                    о проекте. Сделать это можно на отдельной странице.
                  </p>
                  <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-90"
                    style={{
                      background:
                        "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                      color: "#001e1d",
                      boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                    }}
                  >
                    <LucideIcons.Image size="sm" />
                    <span>Оставить отзыв</span>
                    <LucideIcons.ArrowRight size="xs" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {!requiresReview && user && (
            <ApplicationsForm
              {...applicantLabelFromUser(user)}
              category={category}
              setCategory={setCategory}
              title={title}
              setTitle={setTitle}
              summary={summary}
              setSummary={setSummary}
              story={story}
              setStory={setStory}
              amountFormatted={amountFormatted}
              handleAmountInputChange={handleAmountInputChange}
              trustHint={trustHint}
              trustLimitsMax={trustLimits.max}
              payment={payment}
              setPayment={setPayment}
              bankName={bankName}
              setBankName={setBankName}
              photos={photos}
              setPhotos={setPhotos}
              uploading={uploading}
              submitting={submitting}
              left={left}
              err={err}
              fieldErrors={fieldErrors}
              firstErrorKey={firstErrorKey}
              validationScrollTrigger={validationScrollTrigger}
              validateSubmit={validateSubmit}
              executeSubmit={executeSubmit}
              hpCompany={hpCompany}
              setHpCompany={setHpCompany}
              limits={{
                titleMax: LIMITS.titleMax,
                summaryMax: LIMITS.summaryMax,
                storyMin: LIMITS.storyMin,
                storyMax: LIMITS.storyMax,
                amountMin: LIMITS.amountMin,
                paymentMin: LIMITS.paymentMin,
                paymentMax: LIMITS.paymentMax,
                maxPhotos: LIMITS.maxPhotos,
              }}
              amountInputRef={amountInputRef}
              trustAcknowledged={trustAcknowledged}
              trustAck1={trustAck1}
              setTrustAck1={setTrustAck1}
              trustAck2={trustAck2}
              setTrustAck2={setTrustAck2}
              trustAck3={trustAck3}
              setTrustAck3={setTrustAck3}
              policiesAccepted={policiesAccepted}
              setPoliciesAccepted={setPoliciesAccepted}
              ackError={ackError}
              trustSupportNotice={
                exceedsTrustLimit ? (
                  <p className="mt-1 text-xs text-[#94a1b2]">
                    Максимальная сумма для вашего уровня —{" "}
                    {trustLimits.max.toLocaleString("ru-RU")} ₽
                  </p>
                ) : null
              }
              approvedCount={approvedCount}
              reportPhotos={reportPhotos}
              setReportPhotos={setReportPhotos}
            />
          )}
        </div>
      </div>
    </div>
  );
}
