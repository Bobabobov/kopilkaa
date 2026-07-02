"use client";

import {
  FormEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ApplicationsConsent from "@/components/applications/ApplicationsConsent";
import FormField from "@/components/ui/FormField";
import { Card } from "@/components/ui/Card";
import RichTextEditor from "@/components/applications/RichTextEditor";
import PhotoUpload from "@/components/applications/PhotoUpload";
import SubmitSection from "@/components/applications/SubmitSection";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { ApplicationFormAsideIntro } from "@/components/applications/ApplicationFormAsideIntro";
import { ApplicationWizardSidebar } from "@/components/applications/ApplicationWizardSidebar";
import { cardEntranceSpring } from "@/components/applications/applicationWizardMotion";
import type { ApplicationFieldKey } from "@/hooks/applications/formState/validation";
import { ApplicationPhotoStepIntro } from "@/components/applications/ApplicationPhotoStepHints";
import { ApplicationEconomyRules } from "@/components/applications/ApplicationEconomyRules";
import { SbpPaymentNotice } from "@/components/sbp/SbpPaymentNotice";
import { RussianBankSelect } from "@/components/sbp/RussianBankSelect";
import { SbpPhoneField } from "@/components/sbp/SbpPhoneField";
import { detectSbpPhoneCountry } from "@/lib/sbp/validatePhone";
import type { SbpPhoneCountryId } from "@/lib/sbp/sbpPhoneCountries";
import { isApplicationBlockedByBonuses } from "@/lib/applications/applicationEconomy";
import type { ApplicationEligibility } from "@/lib/applications/applicationEconomy";
import { formatDesiredAmountFieldHint } from "@/lib/applications/publicationPricing";

type LocalImage = { file: File; url: string };

type WizardStepId = "base" | "story" | "payment" | "photos";

interface WizardStepDefinition {
  id: WizardStepId;
  label: string;
  /** Что нужно сделать на этом этапе */
  description: string;
  fields: ApplicationFieldKey[];
}

const WIZARD_STEPS: WizardStepDefinition[] = [
  {
    id: "base",
    label: "Основа",
    description:
      "Придумайте заголовок и короткое описание — так материал увидят в списке. Укажите желаемый гонорар в пределах лимита вашего уровня.",
    fields: ["title", "summary", "amount", "desiredAmount"],
  },
  {
    id: "story",
    label: "История",
    description:
      "Расскажите подробно, что случилось и на что планируете потратить гонорар. Пишите честно — это поможет редакторам рассмотреть материал.",
    fields: ["story"],
  },
  {
    id: "payment",
    label: "Данные СБП",
    description:
      "Укажите номер телефона и банк для получения гонорара по СБП. Если материал одобрят, вознаграждение поступит на этот номер.",
    fields: ["bankName", "payment"],
  },
  {
    id: "photos",
    label: "Фото",
    description:
      "Загрузите фото того, что вам нужно. Без контента 18+ и личных данных.",
    fields: ["photos"],
  },
];

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

function stepForField(
  key: ApplicationFieldKey,
  steps: WizardStepDefinition[],
): number {
  const index = steps.findIndex((item) => item.fields.includes(key));
  return index >= 0 ? index : 0;
}

function stepHasError(
  step: number,
  fieldErrors: Partial<Record<ApplicationFieldKey, string>>,
  steps: WizardStepDefinition[],
): boolean {
  return steps[step]?.fields.some((k) => Boolean(fieldErrors[k])) ?? false;
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
  desiredAmountFormatted?: string;
  handleDesiredAmountInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showsDesiredAmount?: boolean;
  desiredAmountInputRef?: React.RefObject<HTMLInputElement | null>;
  payment: string;
  setPayment: (v: string) => void;
  bankName: string;
  setBankName: (v: string) => void;
  photos: LocalImage[];
  setPhotos: (v: LocalImage[]) => void;
  uploading: boolean;
  submitting: boolean;
  left: number | null;
  eligibility?: ApplicationEligibility | null;
  loadingEligibility?: boolean;
  isAdmin?: boolean;
  err: string | null;
  fieldErrors?: Partial<Record<string, string>>;
  firstErrorKey?: string;
  validationScrollTrigger?: number;
  validateSubmit: () => boolean;
  executeSubmit: () => Promise<void>;
  hpCompany: string;
  setHpCompany: (v: string) => void;
  limits: {
    titleMax: number;
    summaryMax: number;
    storyMin: number;
    storyMax: number;
    amountMin: number;
    amountMax: number;
    paymentMin: number;
    paymentMax: number;
    maxPhotos: number;
  };
  amountInputRef: React.RefObject<HTMLInputElement | null>;
  rulesAcknowledged: boolean;
  rulesAck1: boolean;
  setRulesAck1: (v: boolean) => void;
  rulesAck2: boolean;
  setRulesAck2: (v: boolean) => void;
  rulesAck3: boolean;
  setRulesAck3: (v: boolean) => void;
  policiesAccepted: boolean;
  setPoliciesAccepted: (v: boolean) => void;
  ackError: boolean;
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
    desiredAmountFormatted = "",
    handleDesiredAmountInputChange,
    showsDesiredAmount = false,
    desiredAmountInputRef,
    payment,
    setPayment,
    bankName,
    setBankName,
    photos,
    setPhotos,
    uploading,
    submitting,
    left,
    eligibility = null,
    loadingEligibility = false,
    isAdmin = false,
    err,
    fieldErrors,
    firstErrorKey,
    validationScrollTrigger,
    validateSubmit,
    executeSubmit,
    hpCompany,
    setHpCompany,
    limits,
    amountInputRef,
    rulesAcknowledged,
    rulesAck1,
    setRulesAck1,
    rulesAck2,
    setRulesAck2,
    rulesAck3,
    setRulesAck3,
    policiesAccepted,
    setPoliciesAccepted,
    ackError,
    applicantDisplayName,
    applicantAvatarUrl,
  } = props;

  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [stepFeedback, setStepFeedback] = useState<string | null>(null);
  const [phoneCountryId, setPhoneCountryId] = useState<SbpPhoneCountryId>('RU');
  const wizardSteps = WIZARD_STEPS;
  const stepLabels = useMemo(
    () => wizardSteps.map((item) => item.label),
    [wizardSteps],
  );

  useEffect(() => {
    if (!payment.trim()) return;
    setPhoneCountryId((prev) => detectSbpPhoneCountry(payment, prev));
  }, [payment]);
  const totalSteps = wizardSteps.length;
  const currentStep = wizardSteps[step]?.id ?? "base";

  const blockedByBonuses = isApplicationBlockedByBonuses(
    eligibility,
    isAdmin,
  );

  useEffect(() => {
    if (blockedByBonuses && step > 0) {
      setStep(0);
    }
  }, [blockedByBonuses, step]);

  const activeStepLabel =
    blockedByBonuses && step === 0
      ? "Недостаточно бонусов"
      : stepLabels[step];

  const activeStepDescription =
    blockedByBonuses && step === 0
      ? "Пополните баланс бонусов в профиле, чтобы продолжить публикацию истории."
      : wizardSteps[step]?.description ?? "";

  const handleSubmitIntent = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!validateSubmit()) return;
    void executeSubmit();
  };

  const fe = fieldErrors as
    | Partial<Record<ApplicationFieldKey, string>>
    | undefined;

  useEffect(() => {
    if (!err || !firstErrorKey || typeof document === "undefined") return;
    const key = firstErrorKey as ApplicationFieldKey;
    const id = `application-field-${key}`;
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [err, firstErrorKey, validationScrollTrigger]);

  useEffect(() => {
    setStep((current) => Math.min(current, totalSteps - 1));
  }, [totalSteps]);

  const prevValidationTrig = useRef(0);
  useEffect(() => {
    if (validationScrollTrigger === undefined) return;
    if (validationScrollTrigger === prevValidationTrig.current) return;
    prevValidationTrig.current = validationScrollTrigger;
    if (firstErrorKey) {
      setStep(stepForField(firstErrorKey as ApplicationFieldKey, wizardSteps));
    }
  }, [validationScrollTrigger, firstErrorKey, wizardSteps]);

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
    if (step >= totalSteps - 1) return;
    if (blockedByBonuses && step === 0) return;
    if (stepHasError(step, fe ?? {}, wizardSteps)) return;
    if (step === 0) {
      setStepFeedback("Отлично, продолжаем");
    }
    setStep((s) => Math.min(totalSteps - 1, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const stepProgressPct = Math.round(((step + 1) / totalSteps) * 100);

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
            handleSubmitIntent(e);
          }}
          onFocusCapture={() => {
            if (!rulesAcknowledged && !policiesAccepted) return;
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
                <ApplicationFormAsideIntro
                  displayName={applicantDisplayName}
                  avatarUrl={applicantAvatarUrl}
                  eligibility={eligibility}
                  loadingEligibility={loadingEligibility}
                  showEconomyRules={!blockedByBonuses}
                  size="md"
                />
                <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] px-8 pb-8 pt-6 xl:px-10 xl:pb-10">
                  <ApplicationWizardSidebar
                    step={step}
                    labels={stepLabels}
                    onGoToStep={(i) => {
                      if (i < step) setStep(i);
                    }}
                  />
                </div>
              </motion.aside>

              <div className="flex min-w-0 flex-col gap-5 sm:gap-6 lg:gap-7 lg:p-8 xl:p-10 lg:pt-9">
                <ApplicationFormAsideIntro
                  className="lg:hidden"
                  displayName={applicantDisplayName}
                  avatarUrl={applicantAvatarUrl}
                  eligibility={eligibility}
                  loadingEligibility={loadingEligibility}
                  showEconomyRules={!blockedByBonuses}
                  size="sm"
                />
                <div className="space-y-3 lg:hidden">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#fffffe]">
                      Шаг {step + 1} из {totalSteps}
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
                          · {activeStepLabel}
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
                    aria-valuemax={totalSteps}
                  >
                    <WizardProgressFill
                      pct={stepProgressPct}
                      reducedMotion={Boolean(reducedMotion)}
                    />
                  </div>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={activeStepDescription}
                      initial={
                        reducedMotion ? false : { opacity: 0, y: 6 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={
                        reducedMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: -4 }
                      }
                      transition={{ duration: 0.18 }}
                      className="text-sm leading-relaxed text-[#94a1b2]"
                    >
                      {activeStepDescription}
                    </motion.p>
                  </AnimatePresence>
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
                          {activeStepLabel}
                        </motion.h2>
                      </AnimatePresence>
                      <p className="mt-1 text-sm text-[#abd1c6]">
                        Шаг {step + 1} из {totalSteps}
                      </p>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={activeStepDescription}
                          initial={
                            reducedMotion ? false : { opacity: 0, y: 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          exit={
                            reducedMotion
                              ? { opacity: 1 }
                              : { opacity: 0, y: -6 }
                          }
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="mt-2 max-w-xl text-sm leading-relaxed text-[#94a1b2]"
                        >
                          {activeStepDescription}
                        </motion.p>
                      </AnimatePresence>
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

                {/* Без AnimatePresence+motion: при повторном входе на шаг Framer иногда оставлял opacity 0 и ломал TipTap/поля */}
                <div className="relative min-h-[200px] sm:min-h-[220px] lg:min-h-[260px]">
                  <div
                    key={step}
                    className={cn(
                      "w-full",
                      !reducedMotion && "animate-fadeIn",
                    )}
                  >
                    {currentStep === "base" && blockedByBonuses && (
                      <ApplicationEconomyRules
                        eligibility={eligibility}
                        loading={loadingEligibility}
                        variant="step-gate"
                      />
                    )}

                    {currentStep === "base" && !blockedByBonuses && (
                      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6 lg:items-start">
                        <div className="min-w-0">
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
                              placeholder="Например: История о мелкой бытовой хотелке"
                              hint={`До ${limits.titleMax} символов. Ввод вручную, без вставки.`}
                              maxLength={limits.titleMax}
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              manualInputOnly
                              delay={0}
                              required
                              error={fe?.title}
                            />
                          </div>
                        </div>
                        <div className="min-w-0">
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
                              hint={`До ${limits.summaryMax} символов. Ввод вручную, без вставки.`}
                              maxLength={limits.summaryMax}
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              manualInputOnly
                              delay={0}
                              required
                              error={fe?.summary}
                            />
                          </div>
                        </div>
                        <div className="min-w-0 lg:col-span-2">
                          <div
                            id="application-field-amount"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.amount &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            {showsDesiredAmount && (
                              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#94a1b2]">
                                Лимит уровня: до {limits.amountMax.toLocaleString("ru-RU")} ₽
                              </p>
                            )}
                            <FormField
                              type="input"
                              label="Сумма"
                              icon="DollarSign"
                              value={amountFormatted}
                              onChange={() => {}}
                              placeholder={`Например: ${Math.min(limits.amountMax, 5000).toLocaleString("ru-RU")}`}
                              hint={`На вашем уровне доступен гонорар до ${limits.amountMax.toLocaleString("ru-RU")} ₽.`}
                              maxLength={7}
                              charCountVisibility="when_nonempty"
                              showFieldStatus={false}
                              inputProps={{
                                type: "tel",
                                inputMode: "numeric",
                                autoComplete: "off",
                                ref: amountInputRef,
                                onChange: handleAmountInputChange,
                                max: limits.amountMax,
                              }}
                              delay={0}
                              required
                              error={fe?.amount}
                            />
                          </div>
                        </div>

                        {showsDesiredAmount && handleDesiredAmountInputChange && (
                          <div className="min-w-0 lg:col-span-2">
                            <div
                              id="application-field-desiredAmount"
                              className={cn(
                                "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5 space-y-3",
                                fe?.desiredAmount &&
                                  "border-[#e16162]/50 bg-[#e16162]/8",
                              )}
                            >
                              <FormField
                                type="input"
                                label="Желаемая сумма"
                                icon="TrendingUp"
                                value={desiredAmountFormatted}
                                onChange={() => {}}
                                placeholder="Необязательно — если нужна сумма больше лимита"
                                hint={formatDesiredAmountFieldHint(limits.amountMax)}
                                maxLength={7}
                                charCountVisibility="when_nonempty"
                                showFieldStatus={false}
                                inputProps={{
                                  type: "tel",
                                  inputMode: "numeric",
                                  autoComplete: "off",
                                  ref: desiredAmountInputRef,
                                  onChange: handleDesiredAmountInputChange,
                                }}
                                delay={0}
                                error={fe?.desiredAmount}
                              />
                              <p className="text-xs leading-relaxed text-[#94a1b2]">
                                Если вам требуется большая сумма, можете указать её
                                дополнительно. Это не гарантирует одобрение материала,
                                но поможет администрации понять вашу реальную
                                потребность.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {currentStep === "story" && (
                      <div className="space-y-5 lg:max-w-4xl">
                        <div className="rounded-2xl border border-[#abd1c6]/20 bg-[#004643]/35 px-4 py-4 sm:px-5 sm:py-5">
                          <p className="text-sm leading-relaxed text-[#abd1c6]/95">
                            Вы публикуете историю на Копилке — гонорар выплачивает
                            сама платформа, материал проверяет редакция.{" "}
                            <span className="font-semibold text-[#e8f4f0]">
                              Это не кредит, не займ и не переводы от других
                              людей
                            </span>
                            .{" "}
                            <span className="font-semibold text-[#e8f4f0]">
                              Напишите честно, что случилось и зачем нужны
                              средства
                            </span>
                            : при одобрении гонорар поступит на ваш номер СБП.{" "}
                            <span className="font-semibold text-[#f9bc60]">
                              Возвращать ничего не нужно
                            </span>{" "}
                            — это безвозмездное поощрение авторов в рамках правил
                            Копилки.
                          </p>
                        </div>
                        <div>
                          <div
                            id="application-field-story"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
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
                              placeholder="Что случилось, зачем нужен гонорар, как планируете использовать вознаграждение…"
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
                        </div>
                      </div>
                    )}

                    {currentStep === "payment" && (
                      <div className="grid gap-5 lg:max-w-3xl lg:gap-6">
                        <SbpPaymentNotice variant="application" />

                        <div>
                          <div
                            id="application-field-payment"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.payment &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <SbpPhoneField
                              value={payment}
                              onChange={setPayment}
                              onCountryChange={setPhoneCountryId}
                              required
                              error={fe?.payment}
                              disabled={submitting}
                            />
                          </div>
                        </div>

                        <div>
                          <div
                            id="application-field-bankName"
                            className={cn(
                              "rounded-2xl p-3 sm:p-4 -mx-1 border border-transparent transition-colors lg:p-5",
                              fe?.bankName &&
                                "border-[#e16162]/50 bg-[#e16162]/8",
                            )}
                          >
                            <RussianBankSelect
                              value={bankName}
                              onChange={setBankName}
                              countryId={phoneCountryId}
                              required
                              error={fe?.bankName}
                              disabled={submitting}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === "photos" && (
                      <div className="grid gap-5 lg:max-w-4xl lg:gap-6">
                        <div>
                          <ApplicationPhotoStepIntro />
                        </div>

                        <div>
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
                              title="Загрузите файлы к этой истории"
                              subtitle="Добавьте хотя бы одно фото. Без контента 18+ и личных данных."
                            />
                          </div>
                        </div>

                        <div>
                          <ApplicationsConsent
                            rulesAck1={rulesAck1}
                            setRulesAck1={setRulesAck1}
                            rulesAck2={rulesAck2}
                            setRulesAck2={setRulesAck2}
                            rulesAck3={rulesAck3}
                            setRulesAck3={setRulesAck3}
                            policiesAccepted={policiesAccepted}
                            setPoliciesAccepted={setPoliciesAccepted}
                            ackError={ackError}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden lg:block">
                  {step === totalSteps - 1 ? (
                    <div className="space-y-4 border-t border-white/10 pt-8">
                      <SubmitSection
                        submitting={submitting}
                        uploading={uploading}
                        left={left}
                        eligibility={eligibility}
                        isAdmin={isAdmin}
                        err={
                          err &&
                          fieldErrors &&
                          Object.keys(fieldErrors).length > 0
                            ? "Исправьте отмеченные поля"
                            : err
                        }
                        onSubmit={(e) => {
                          handleSubmitIntent(e);
                        }}
                      />
                    </div>
                  ) : blockedByBonuses && step === 0 ? (
                    <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-8">
                      <p className="text-center text-sm text-[#abd1c6]">
                        Накопите бонусы, чтобы продолжить публикацию истории.
                      </p>
                      <Link
                        href="/profile"
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-10 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-92"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          boxShadow: "0 10px 28px rgba(249, 188, 96, 0.22)",
                        }}
                      >
                        Перейти в профиль
                        <LucideIcons.ArrowRight size="xs" />
                      </Link>
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
                  {step === totalSteps - 1 ? (
                    <div className="space-y-3 w-full">
                      <SubmitSection
                        submitting={submitting}
                        uploading={uploading}
                        left={left}
                        eligibility={eligibility}
                        isAdmin={isAdmin}
                        err={
                          err &&
                          fieldErrors &&
                          Object.keys(fieldErrors).length > 0
                            ? "Исправьте отмеченные поля"
                            : err
                        }
                        onSubmit={(e) => {
                          handleSubmitIntent(e);
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
                  ) : blockedByBonuses && step === 0 ? (
                    <div className="flex flex-col items-center gap-4 border-t border-white/10 pt-8">
                      <p className="text-center text-sm text-[#abd1c6]">
                        Накопите бонусы, чтобы продолжить публикацию истории.
                      </p>
                      <Link
                        href="/profile"
                        className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-10 text-sm font-semibold text-[#001e1d] transition-opacity hover:opacity-92"
                        style={{
                          background:
                            "linear-gradient(135deg, #e8a545 0%, #f9bc60 50%, #e8a545 100%)",
                          boxShadow: "0 10px 28px rgba(249, 188, 96, 0.22)",
                        }}
                      >
                        Перейти в профиль
                        <LucideIcons.ArrowRight size="xs" />
                      </Link>
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
