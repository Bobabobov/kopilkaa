"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import ApplicationsConsent from "@/components/applications/ApplicationsConsent";
import FormField from "@/components/ui/FormField";
import { Card } from "@/components/ui/Card";
import RichTextEditor from "@/components/applications/RichTextEditor";
import PhotoUpload from "@/components/applications/PhotoUpload";
import SubmitSection from "@/components/applications/SubmitSection";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { ApplicationApplicantStrip } from "@/components/applications/ApplicationApplicantStrip";
import { ApplicationWizardSidebar } from "@/components/applications/ApplicationWizardSidebar";
import {
  cardEntranceSpring,
  wizardStaggerContainer,
  wizardStaggerItem,
} from "@/components/applications/applicationWizardMotion";
import type { ApplicationFieldKey } from "@/hooks/applications/formState/validation";

type LocalImage = { file: File; url: string };

const WIZARD_STEPS = 4;

const STEP_LABELS = ["Основа", "История", "Реквизиты", "Фото"];

function WizardProgressFill({
  pct,
  reducedMotion,
}: {
  pct: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className={cn(
        "relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#e8a545] via-[#ffd180] to-[#f9bc60]",
        !reducedMotion && "shadow-[0_0_14px_rgba(249,188,96,0.4)]",
      )}
      initial={false}
      animate={{ width: `${pct}%` }}
      transition={{
        type: "spring",
        stiffness: 110,
        damping: 22,
      }}
    >
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute left-0 top-0 h-full w-[42%] -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-90"
          animate={{ x: ["-35%", "260%"] }}
          transition={{
            duration: 2.15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatDelay: 0.85,
          }}
        />
      )}
    </motion.div>
  );
}

function stepForField(key: ApplicationFieldKey): number {
  switch (key) {
    case "title":
    case "summary":
    case "amount":
      return 0;
    case "story":
      return 1;
    case "bankName":
    case "payment":
      return 2;
    case "photos":
      return 3;
    default:
      return 0;
  }
}

function stepFieldKeys(step: number): ApplicationFieldKey[] {
  switch (step) {
    case 0:
      return ["title", "summary", "amount"];
    case 1:
      return ["story"];
    case 2:
      return ["bankName", "payment"];
    case 3:
      return ["photos"];
    default:
      return [];
  }
}

function stepHasError(
  step: number,
  fieldErrors: Partial<Record<ApplicationFieldKey, string>>,
): boolean {
  return stepFieldKeys(step).some((k) => Boolean(fieldErrors[k]));
}

type Props = {
  title: string;
  setTitle: (v: string) => void;
  summary: string;
  setSummary: (v: string) => void;
  story: string;
  setStory: (v: string) => void;
  amountFormatted: string;
  handleAmountInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  trustHint: string;
  trustLimitsMax: number;
  payment: string;
  setPayment: (v: string) => void;
  bankName: string;
  setBankName: (v: string) => void;
  photos: LocalImage[];
  setPhotos: (v: LocalImage[]) => void;
  uploading: boolean;
  submitting: boolean;
  left: number | null;
  err: string | null;
  fieldErrors?: Partial<Record<string, string>>;
  firstErrorKey?: string;
  validationScrollTrigger?: number;
  submit: (e?: FormEvent) => Promise<void>;
  hpCompany: string;
  setHpCompany: (v: string) => void;
  limits: {
    titleMax: number;
    summaryMax: number;
    storyMin: number;
    storyMax: number;
    amountMin: number;
    paymentMin: number;
    paymentMax: number;
    maxPhotos: number;
  };
  amountInputRef: React.RefObject<HTMLInputElement | null>;
  trustAcknowledged: boolean;
  trustAck1: boolean;
  setTrustAck1: (v: boolean) => void;
  trustAck2: boolean;
  setTrustAck2: (v: boolean) => void;
  trustAck3: boolean;
  setTrustAck3: (v: boolean) => void;
  policiesAccepted: boolean;
  setPoliciesAccepted: (v: boolean) => void;
  ackError: boolean;
  trustSupportNotice?: ReactNode;
  approvedCount: number | null;
  reportPhotos: LocalImage[];
  setReportPhotos: (v: LocalImage[]) => void;
  /** Имя и аватар для подписи «кто заполняет» */
  applicantDisplayName: string;
  applicantAvatarUrl?: string | null;
};

export function ApplicationsForm(props: Props) {
  const {
    title,
    setTitle,
    summary,
    setSummary,
    story,
    setStory,
    amountFormatted,
    handleAmountInputChange,
    trustHint,
    trustLimitsMax,
    payment,
    setPayment,
    bankName,
    setBankName,
    photos,
    setPhotos,
    uploading,
    submitting,
    left,
    err,
    fieldErrors,
    firstErrorKey,
    validationScrollTrigger,
    submit,
    hpCompany,
    setHpCompany,
    limits,
    amountInputRef,
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
    trustSupportNotice,
    approvedCount,
    reportPhotos,
    setReportPhotos,
    applicantDisplayName,
    applicantAvatarUrl,
  } = props;

  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);

  const fe = fieldErrors as
    | Partial<Record<ApplicationFieldKey, string>>
    | undefined;

  useEffect(() => {
    if (!err || !firstErrorKey || typeof document === "undefined") return;
    const key = firstErrorKey as ApplicationFieldKey;
    const id =
      key === "photos"
        ? "application-field-photos"
        : `application-field-${key}`;
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [err, firstErrorKey, validationScrollTrigger]);

  const prevValidationTrig = useRef(0);
  useEffect(() => {
    if (validationScrollTrigger === undefined) return;
    if (validationScrollTrigger === prevValidationTrig.current) return;
    prevValidationTrig.current = validationScrollTrigger;
    if (firstErrorKey) {
      setStep(stepForField(firstErrorKey as ApplicationFieldKey));
    }
  }, [validationScrollTrigger, firstErrorKey]);

  useEffect(() => {
    if (!ackError) return;
    const t = window.setTimeout(() => {
      document
        .getElementById("application-field-consent")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => window.clearTimeout(t);
  }, [ackError]);

  useEffect(() => {
    if (!stepFeedback) return;
    const t = window.setTimeout(() => setStepFeedback(null), 3200);
    return () => window.clearTimeout(t);
  }, [stepFeedback]);

  const goNext = () => {
    if (step >= WIZARD_STEPS - 1) return;
    if (stepHasError(step, fe ?? {})) return;
    if (step === 0) {
      setStepFeedback("Отлично, продолжаем");
    }
    setStep((s) => Math.min(WIZARD_STEPS - 1, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const stepProgressPct = Math.round(((step + 1) / WIZARD_STEPS) * 100);

  return (
    <motion.div
      className="relative"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0.01 } : cardEntranceSpring}
    >
      <Card
        variant="darkGlass"
        padding="none"
        className="overflow-hidden lg:rounded-[28px] lg:shadow-[0_24px_64px_rgba(0,0,0,0.32)]"
      >
        <form
          className="flex flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            submit(e);
          }}
          onFocusCapture={() => {
            if (!trustAcknowledged && !policiesAccepted) return;
          }}
        >
          <div
            aria-hidden="true"
            className="fixed left-[-10000px] top-auto w-px h-px overflow-hidden"
          >
            <label>
              Company
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={hpCompany}
                onChange={(e) => setHpCompany(e.target.value)}
              />
            </label>
          </div>

          <div className="p-4 sm:p-5 lg:p-0">
            <div className="lg:grid lg:grid-cols-[minmax(220px,252px)_minmax(0,1fr)] xl:grid-cols-[268px_minmax(0,1fr)] lg:items-stretch">
              <motion.aside
                className="hidden lg:block lg:border-r lg:border-white/10 lg:bg-white/[0.02]"
                initial={reducedMotion ? false : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={
                  reducedMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 260, damping: 28 }
                }
              >
                <div className="border-b border-white/10 px-8 pb-5 pt-8 xl:px-10 xl:pt-10">
                  <ApplicationApplicantStrip
                    displayName={applicantDisplayName}
                    avatarUrl={applicantAvatarUrl}
                    size="md"
                  />
                </div>
                <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] px-8 pb-8 pt-6 xl:px-10 xl:pb-10">
                  <ApplicationWizardSidebar
                    step={step}
                    labels={STEP_LABELS}
                    onGoToStep={(i) => {
                      if (i < step) setStep(i);
                    }}
                  />
                </div>
              </motion.aside>

              <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-7 lg:p-8 xl:p-10 lg:pt-9">
                <div className="lg:hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 sm:px-4">
                  <ApplicationApplicantStrip
                    displayName={applicantDisplayName}
                    avatarUrl={applicantAvatarUrl}
                    size="sm"
                  />
                </div>
                <div className="space-y-3 lg:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#fffffe]">
                      Шаг {step + 1} из {WIZARD_STEPS}
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={step}
                          initial={
                            reducedMotion
                              ? false
                              : { opacity: 0, y: 6 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: -5 }
                          }
                          transition={{ duration: 0.18 }}
                          className="text-[#94a1b2] font-normal"
                        >
                          {" "}
                          · {STEP_LABELS[step]}
                        </motion.span>
                      </AnimatePresence>
                    </p>
                    <motion.span
                      key={stepProgressPct}
                      initial={
                        reducedMotion ? false : { opacity: 0, y: -4 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="text-xs tabular-nums text-[#f9bc60] font-semibold"
                    >
                      {stepProgressPct}%
                    </motion.span>
                  </div>
                  <div
                    className="h-2 w-full rounded-full bg-[#001e1d]/50 overflow-hidden ring-1 ring-white/[0.06]"
                    role="progressbar"
                    aria-valuenow={step + 1}
                    aria-valuemin={1}
                    aria-valuemax={WIZARD_STEPS}
                  >
                    <WizardProgressFill
                      pct={stepProgressPct}
                      reducedMotion={Boolean(reducedMotion)}
                    />
                  </div>
                </div>

                <div className="hidden lg:block space-y-3">
                  <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#94a1b2]">
                        Текущий этап
                      </p>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.h2
                          key={step}
                          initial={
                            reducedMotion
                              ? false
                              : { opacity: 0, y: 10 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: -8 }
                          }
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="mt-1 text-xl font-semibold tracking-tight text-[#fffffe] xl:text-2xl"
                        >
                          {STEP_LABELS[step]}
                        </motion.h2>
                      </AnimatePresence>
                      <p className="mt-1 text-sm text-[#abd1c6]">
                        Шаг {step + 1} из {WIZARD_STEPS}
                      </p>
                    </div>
                    <div
                      className="flex shrink-0 flex-col items-end gap-2"
                      aria-hidden
                    >
                      <motion.span
                        key={stepProgressPct}
                        initial={
                          reducedMotion ? false : { opacity: 0, scale: 0.92 }
                        }
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 26,
                        }}
                        className="text-sm font-semibold tabular-nums text-[#f9bc60]"
                      >
                        {stepProgressPct}%
                      </motion.span>
                      <div className="h-2 w-36 overflow-hidden rounded-full bg-[#001e1d]/50 ring-1 ring-white/[0.06] xl:w-44">
                        <WizardProgressFill
                          pct={stepProgressPct}
                          reducedMotion={Boolean(reducedMotion)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {stepFeedback && (
                    <motion.div
                      key={stepFeedback}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#f9bc60]/35 bg-[#f9bc60]/10 px-3 py-2.5 text-sm text-[#fffffe] text-center"
                    >
                      <LucideIcons.Sparkles
                        size="xs"
                        className="shrink-0 text-[#f9bc60]"
                      />
                      {stepFeedback}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="min-h-[200px] sm:min-h-[220px] lg:min-h-[260px]"
                  >
                    {step === 0 && (
                      <motion.div
                        className="grid gap-5 lg:gap-6"
                        variants={wizardStaggerContainer}
                        initial="hidden"
                        animate="show"
                      >
                        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
                          <motion.div
                            variants={wizardStaggerItem}
                            className="min-w-0"
                          >
                            <div
                              id="application-field-title"
                              className={cn(
                                "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                                fe?.title &&
                                  "border-[#e16162]/50 bg-[#e16162]/8",
                              )}
                            >
                              <FormField
                                type="input"
                                label="Заголовок"
                                icon="Home"
                                value={title}
                                onChange={setTitle}
                                placeholder="Например: Помощь с арендой после сокращения"
                                hint={`До ${limits.titleMax} символов`}
                                maxLength={limits.titleMax}
                                charCountVisibility="when_nonempty"
                                showFieldStatus={false}
                                delay={0}
                                required
                                error={fe?.title}
                              />
                            </div>
                          </motion.div>
                          <motion.div
                            variants={wizardStaggerItem}
                            className="min-w-0"
                          >
                            <div
                              id="application-field-summary"
                              className={cn(
                                "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                                fe?.summary &&
                                  "border-[#e16162]/50 bg-[#e16162]/8",
                              )}
                            >
                              <FormField
                                type="input"
                                label="Краткое описание"
                                icon="MessageCircle"
                                value={summary}
                                onChange={setSummary}
                                placeholder="3–10 слов для списка заявок"
                                hint={`До ${limits.summaryMax} символов`}
                                maxLength={limits.summaryMax}
                                charCountVisibility="when_nonempty"
                                showFieldStatus={false}
                                delay={0}
                                required
                                error={fe?.summary}
                              />
                            </div>
                          </motion.div>
                        </div>
                        <motion.div variants={wizardStaggerItem}>
                          <div
                            id="application-field-amount"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.amount &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <FormField
                              type="input"
                              label="Сумма"
                              icon="DollarSign"
                              value={amountFormatted}
                              onChange={() => {}}
                              placeholder="Например: 5 000"
                              hint={`От ${limits.amountMin} ₽. ${trustHint}`.trim()}
                              maxLength={7}
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              inputProps={{
                                type: "tel",
                                inputMode: "numeric",
                                autoComplete: "off",
                                ref: amountInputRef,
                                onChange: handleAmountInputChange,
                                max: trustLimitsMax,
                              }}
                              delay={0}
                              required
                              error={fe?.amount}
                            />
                            {trustSupportNotice}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {step === 1 && (
                      <motion.div
                        variants={wizardStaggerContainer}
                        initial="hidden"
                        animate="show"
                      >
                        <motion.div variants={wizardStaggerItem}>
                          <div
                            id="application-field-story"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:max-w-4xl lg:p-5",
                              fe?.story &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <label
                              className="block text-sm font-medium mb-2"
                              style={{ color: "#abd1c6" }}
                            >
                              Подробная история *
                            </label>
                            <p className="text-xs text-[#94a1b2] mb-3">
                              От {limits.storyMin} до {limits.storyMax}{" "}
                              символов без пробелов. Ввод вручную, без вставки.
                            </p>
                            <RichTextEditor
                              value={story}
                              onChange={setStory}
                              placeholder="Что случилось, зачем нужна поддержка, как планируете использовать средства…"
                              minLength={limits.storyMin}
                              maxLength={limits.storyMax}
                              rows={8}
                              className="lg:[&_.ProseMirror]:min-h-[14rem]"
                              allowLinks={false}
                              required
                              error={fe?.story}
                              charCountVisibility="when_nonempty"
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        className="grid gap-5 lg:max-w-3xl lg:gap-6"
                        variants={wizardStaggerContainer}
                        initial="hidden"
                        animate="show"
                      >
                        <motion.div variants={wizardStaggerItem}>
                          <div
                            id="application-field-bankName"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.bankName &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <FormField
                              type="input"
                              label="Банк"
                              icon="CreditCard"
                              value={bankName}
                              onChange={setBankName}
                              placeholder="Например: Тинькофф, Сбер"
                              hint="Название банка получателя"
                              maxLength={15}
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              delay={0}
                              required
                              error={fe?.bankName}
                            />
                          </div>
                        </motion.div>
                        <motion.div variants={wizardStaggerItem}>
                          <div
                            id="application-field-payment"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.payment &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <FormField
                              type="textarea"
                              label="Реквизиты для получения помощи"
                              icon="CreditCard"
                              value={payment}
                              onChange={setPayment}
                              placeholder="Счёт, СБП или карта МИР — по шаблону банка"
                              hint={`МИР / СБП / счёт (не Visa/Mastercard). От ${limits.paymentMin} до ${limits.paymentMax} символов.`}
                              minLength={limits.paymentMin}
                              maxLength={limits.paymentMax}
                              compact
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              delay={0}
                              required
                              error={fe?.payment}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        className="grid gap-5 lg:max-w-4xl lg:gap-6"
                        variants={wizardStaggerContainer}
                        initial="hidden"
                        animate="show"
                      >
                        <motion.div variants={wizardStaggerItem}>
                          <div
                            id="application-field-photos"
                            className={cn(
                              "rounded-2xl p-2 -mx-1 border border-transparent transition-colors",
                              fe?.photos &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <PhotoUpload
                              photos={photos}
                              onPhotosChange={setPhotos}
                              maxPhotos={limits.maxPhotos}
                              delay={0}
                              error={fe?.photos}
                              inputId="application-photos-upload"
                              variant="dark"
                              title="Фото к заявке"
                              subtitle="Хотя бы одно фото обязательно"
                            />
                          </div>
                        </motion.div>

                        {approvedCount !== null && approvedCount >= 1 && (
                          <motion.div variants={wizardStaggerItem}>
                            <div className="rounded-2xl p-2 -mx-1 border border-transparent">
                              <PhotoUpload
                                photos={reportPhotos}
                                onPhotosChange={setReportPhotos}
                                maxPhotos={5}
                                delay={0}
                                inputId="report-photos-upload"
                                variant="dark"
                                title="Отчёт по прошлой заявке"
                                subtitle="Минимум одно фото для отправки: чек, результат, переписка — видит только админ"
                              />
                            </div>
                          </motion.div>
                        )}

                        <motion.div variants={wizardStaggerItem}>
                          <ApplicationsConsent
                            trustAck1={trustAck1}
                            setTrustAck1={setTrustAck1}
                            trustAck2={trustAck2}
                            setTrustAck2={setTrustAck2}
                            trustAck3={trustAck3}
                            setTrustAck3={setTrustAck3}
                            policiesAccepted={policiesAccepted}
                            setPoliciesAccepted={setPoliciesAccepted}
                            ackError={ackError}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="hidden lg:block">
                  {step === WIZARD_STEPS - 1 ? (
                    <div className="space-y-4 border-t border-white/10 pt-8">
                      <SubmitSection
                        submitting={submitting}
                        uploading={uploading}
                        left={left}
                        err={
                          err &&
                          fieldErrors &&
                          Object.keys(fieldErrors).length > 0
                            ? "Исправьте отмеченные поля"
                            : err
                        }
                        onSubmit={(e) => {
                          e.preventDefault();
                          submit(e);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
                      <motion.button
                        type="button"
                        onClick={goBack}
                        disabled={step === 0}
                        whileHover={
                          step === 0 || reducedMotion
                            ? undefined
                            : { scale: 1.02 }
                        }
                        whileTap={
                          step === 0 || reducedMotion
                            ? undefined
                            : { scale: 0.97 }
                        }
                        className={cn(
                          "min-h-[46px] rounded-xl px-7 text-sm font-semibold text-[#abd1c6] transition-colors",
                          "border border-[#abd1c6]/35 hover:bg-white/[0.06]",
                          "disabled:pointer-events-none disabled:opacity-35",
                        )}
                      >
                        Назад
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={goNext}
                        whileHover={
                          reducedMotion ? undefined : { scale: 1.03, y: -1 }
                        }
                        whileTap={
                          reducedMotion ? undefined : { scale: 0.97 }
                        }
                        className="min-h-[46px] rounded-xl px-10 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-92"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          boxShadow: "0 10px 28px rgba(249, 188, 96, 0.22)",
                        }}
                      >
                        Далее
                      </motion.button>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "lg:hidden shrink-0 mt-1 pt-4 border-t border-white/10",
                    "pb-[max(4px,env(safe-area-inset-bottom))]",
                  )}
                >
                  {step === WIZARD_STEPS - 1 ? (
                    <div className="space-y-3 w-full">
                      <SubmitSection
                        submitting={submitting}
                        uploading={uploading}
                        left={left}
                        err={
                          err &&
                          fieldErrors &&
                          Object.keys(fieldErrors).length > 0
                            ? "Исправьте отмеченные поля"
                            : err
                        }
                        onSubmit={(e) => {
                          e.preventDefault();
                          submit(e);
                        }}
                      />
                      <motion.button
                        type="button"
                        onClick={goBack}
                        whileHover={
                          reducedMotion ? undefined : { scale: 1.01 }
                        }
                        whileTap={
                          reducedMotion ? undefined : { scale: 0.98 }
                        }
                        className="w-full rounded-xl py-3 text-sm font-medium text-[#abd1c6] border border-[#abd1c6]/25"
                      >
                        Назад
                      </motion.button>
                    </div>
                  ) : (
                    <div className="flex gap-3 w-full">
                      <motion.button
                        type="button"
                        onClick={goBack}
                        disabled={step === 0}
                        whileHover={
                          step === 0 || reducedMotion
                            ? undefined
                            : { scale: 1.02 }
                        }
                        whileTap={
                          step === 0 || reducedMotion
                            ? undefined
                            : { scale: 0.97 }
                        }
                        className={cn(
                          "min-h-[48px] flex-1 rounded-xl py-3.5 text-sm font-semibold border border-[#abd1c6]/35 text-[#abd1c6]",
                          "disabled:opacity-35 disabled:pointer-events-none",
                        )}
                      >
                        Назад
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={goNext}
                        whileHover={
                          reducedMotion ? undefined : { scale: 1.02, y: -1 }
                        }
                        whileTap={
                          reducedMotion ? undefined : { scale: 0.98 }
                        }
                        className="min-h-[48px] flex-[1.35] rounded-xl py-3.5 text-sm font-semibold text-[#001e1d]"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          boxShadow: "0 4px 16px rgba(249, 188, 96, 0.2)",
                        }}
                      >
                        Далее
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

export default ApplicationsForm;
