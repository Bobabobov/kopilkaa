// app/applications/page.tsx
"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { usePageTimeTracking } from "@/lib/usePageTimeTracking";
import { cn } from "@/lib/utils";
import Link from "next/link";
import TrustLevelsInfo from "@/components/applications/TrustLevelsInfo";
import ApplicationsTips from "@/components/applications/ApplicationsTips";
import ApplicationsForm from "@/components/applications/ApplicationsForm";
import { useApplicationFormState, LIMITS } from "@/hooks/applications/useApplicationFormState";
import TrustIntroModal from "@/components/applications/TrustIntroModal";
import { getTrustLabel } from "@/lib/trustLevel";

const SuccessScreen = dynamic(() => import("@/components/applications/SuccessScreen"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const PageHeader = dynamic(() => import("@/components/applications/PageHeader"), {
  ssr: false,
  loading: () => <div className="h-24 bg-[#004643]/30 animate-pulse rounded-2xl" />
});

export default function ApplicationsPage() {
  usePageTimeTracking({ page: "/applications", enabled: true, sendInterval: 30000 });

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
    setTrustAcknowledged,
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
    submit,
    setSubmitted,
    requiresReview,
  } = state;

  const { introAckKey } = state;

  // Остальная логика вынесена в useApplicationFormState

  // Показываем загрузку пока проверяем авторизацию
  if (loadingAuth) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-3xl card p-6 text-center"
      >
        <div>Проверка авторизации...</div>
      </motion.div>
    );
  }

  // Если пользователь не авторизован, ничего не показываем (уже перенаправили)
  if (!user) {
    return null;
  }

  // Экран успешной отправки
  if (submitted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="container-p mx-auto pt-0 sm:pt-1 pb-8 relative z-10">
          <SuccessScreen onNewApplication={() => setSubmitted(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <TrustIntroModal
        open={introOpen}
        checked={introChecked}
        onCheckedChange={setIntroChecked}
        onConfirm={() => {
          setIntroOpen(false);
          sessionStorage.setItem(introAckKey, "true");
          localStorage.setItem(introAckKey, "true");
        }}
      />

      <PageHeader />

      <div
        className={cn(
          "container-p mx-auto max-w-7xl relative z-10 px-3 sm:px-4",
          introOpen ? "pointer-events-none select-none opacity-60" : "",
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="xl:col-span-1 order-2 lg:order-1">
            <ApplicationsTips />
          </div>

          <div className="xl:col-span-3 order-1 lg:order-2">
            <TrustLevelsInfo />

              {requiresReview ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-[#f9bc60]/40 bg-gradient-to-br from-[#f9bc60]/15 via-[#001e1d]/60 to-[#001e1d]/70 backdrop-blur-xl p-6 sm:p-8 text-white shadow-[0_20px_50px_-28px_rgba(249,188,96,0.3)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#f9bc60]/20 blur-3xl rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#e16162]/10 blur-2xl rounded-full pointer-events-none" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f9bc60] to-[#e16162] flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <LucideIcons.MessageCircle size="sm" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-xl sm:text-2xl font-semibold text-white">
                        Необходимо оставить отзыв
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                        У вас есть одобренная заявка, но вы ещё не оставили отзыв. Чтобы создать новую заявку, 
                        пожалуйста, сначала поделитесь своим опытом на странице отзывов.
                      </p>
                      <Link
                        href="/reviews"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f9bc60] to-[#e16162] hover:from-[#f9bc60] hover:to-[#e16162] px-5 py-3 text-sm font-semibold text-[#001e1d] transition-all hover:shadow-xl hover:shadow-[#f9bc60]/30 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <LucideIcons.MessageCircle size="sm" />
                        <span>Перейти к отзывам</span>
                        <LucideIcons.ArrowRight size="xs" />
                      </Link>
                    </div>
                  </div>
                </div>
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
              setTrustAcknowledged={setTrustAcknowledged}
              policiesAccepted={policiesAccepted}
              setPoliciesAccepted={setPoliciesAccepted}
              ackError={ackError}
              trustSupportNotice={
                exceedsTrustLimit ? (
                  <p className="mt-1 text-xs text-[#94a1b2]">
                    Максимальная сумма для вашего уровня — {trustLimits.max.toLocaleString("ru-RU")} ₽
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
