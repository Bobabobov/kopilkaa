"use client";

import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { Card, CardContent } from "@/components/ui/Card";
import { usePageTimeTracking } from "@/hooks/ui/usePageTimeTracking";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TelegramIcon } from "@/components/ui/icons/TelegramIcon";
import TrustLevelsInfo from "@/components/applications/TrustLevelsInfo";
import ApplicationsForm from "@/components/applications/ApplicationsForm";
import {
  useApplicationFormState,
  LIMITS,
} from "@/hooks/applications/useApplicationFormState";
import TrustIntroModal from "@/components/applications/TrustIntroModal";
import ActivityRequirementModal from "@/components/applications/ActivityRequirementModal";
import SuccessScreen from "@/components/applications/SuccessScreen";
import PageHeader from "@/components/applications/PageHeader";
import {
  APPLICATIONS_SUBMISSION_DISABLED_MESSAGE,
  APPLICATIONS_SUBMISSION_ENABLED,
} from "@/lib/applications/submissionControl";

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
    progressPercentage,
    filledFields,
    totalFields,
    valid,
    exceedsTrustLimit,
    fieldErrors,
    firstErrorKey,
    validationScrollTrigger,
    submit,
    setSubmitted,
    requiresReview,
    activityModal,
    setActivityModal,
  } = state;

  const { introAckKey } = state;

  if (loadingAuth) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card variant="darkGlass" padding="lg" className="max-w-md text-center">
            <CardContent>
              <div className="flex items-center justify-center gap-2 text-[#abd1c6]">
                <LucideIcons.Loader2 className="h-5 w-5 animate-spin text-[#f9bc60]" />
                <span>Проверка авторизации...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!APPLICATIONS_SUBMISSION_ENABLED) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <PageHeader />
        <div className="container-p mx-auto max-w-3xl pt-2 pb-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card variant="darkGlass" padding="lg" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0 bg-[#f9bc60]">
                    <LucideIcons.AlertTriangle size="sm" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#fffffe]">
                      Подача заявок временно недоступна
                    </h1>
                    <p className="text-sm sm:text-base text-[#abd1c6] leading-relaxed">
                      {APPLICATIONS_SUBMISSION_DISABLED_MESSAGE}
                    </p>
                    <p className="text-sm text-[#94a1b2]">
                      Работы уже идут, скоро снова откроем форму. Спасибо за понимание.
                    </p>
                    <Link
                      href="https://t.me/+MVL9z_I6LOVjNmE6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center gap-3 rounded-xl border border-[#229ED9]/40 bg-[#229ED9]/10 px-3 py-2.5 text-[#abd1c6] transition-all hover:border-[#229ED9]/60 hover:bg-[#229ED9]/15"
                    >
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#229ED9]/40 bg-[#001e1d]/60">
                        <img
                          src="/logo12.png"
                          alt="Telegram"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/logo.png";
                          }}
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#229ED9]">
                          <TelegramIcon className="h-2.5 w-2.5 text-white" />
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#fffffe]">
                          Следите за новостями тут
                        </p>
                        <p className="text-xs text-[#abd1c6]/80">
                          Публикуем обновления по запуску подачи заявок
                        </p>
                      </div>
                      <LucideIcons.ArrowRight
                        size="xs"
                        className="ml-auto text-[#229ED9] flex-shrink-0"
                      />
                    </Link>
                    <div className="pt-2">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-90"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          color: "#001e1d",
                          boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                        }}
                      >
                        <span>Вернуться на главную</span>
                        <LucideIcons.ArrowRight size="xs" />
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card variant="darkGlass" padding="lg" className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#f9bc60]/15 border border-[#f9bc60]/30">
                <LucideIcons.User className="w-7 h-7 text-[#f9bc60]" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#fffffe] mb-3">
              Войдите, чтобы подать заявку
            </h1>
            <p className="text-[#abd1c6] mb-6 leading-relaxed">
              Окно входа или регистрации должно открыться автоматически. Если этого не произошло — обновите страницу.
            </p>
            <p className="text-sm text-[#94a1b2]">
              После входа вы вернётесь на эту страницу и сможете заполнить заявку.
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
        </div>
        <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>
      <TrustIntroModal
        open={introOpen}
        checked={introChecked}
        onCheckedChange={setIntroChecked}
        onConfirm={() => {
          setIntroOpen(false);
          try {
            sessionStorage.setItem(introAckKey, "true");
            localStorage.setItem(introAckKey, "true");
          } catch {
            // storage может быть недоступен в in-app браузере (Telegram и др.)
          }
        }}
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
          "container-p mx-auto max-w-7xl relative z-10 px-3 sm:px-4",
          introOpen ? "pointer-events-none select-none opacity-60" : "",
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="xl:col-span-4 order-1">
            <TrustLevelsInfo />

            {requiresReview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card variant="darkGlass" padding="lg" className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#f9bc60]/10 blur-3xl rounded-full pointer-events-none" aria-hidden />
                  <CardContent className="relative flex items-start gap-4 p-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#001e1d] flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #f9bc60 0%, #e8a545 100%)" }}
                    >
                      <LucideIcons.MessageCircle size="sm" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl sm:text-2xl font-semibold text-[#fffffe]">
                        Необходимо оставить отзыв
                      </h2>
                      <p className="text-sm sm:text-base text-[#abd1c6] leading-relaxed">
                        У вас есть одобренная заявка, но вы ещё не оставили
                        отзыв. Чтобы создать новую заявку, пожалуйста, сначала
                        поделитесь своим опытом на странице отзывов.
                      </p>
                      <Link
                        href="/reviews"
                        className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          color: "#001e1d",
                          boxShadow: "0 8px 24px rgba(249, 188, 96, 0.25)",
                        }}
                      >
                        <LucideIcons.MessageCircle size="sm" />
                        <span>Перейти к отзывам</span>
                        <LucideIcons.ArrowRight size="xs" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <ApplicationsForm
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
                submit={submit}
                hpCompany={hpCompany}
                setHpCompany={setHpCompany}
                progressPercentage={progressPercentage}
                filledFields={filledFields}
                totalFields={totalFields}
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
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
