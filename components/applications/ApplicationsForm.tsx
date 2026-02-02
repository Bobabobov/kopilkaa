"use client";

import { FormEvent, ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ApplicationsProgress from "@/components/applications/ApplicationsProgress";
import ApplicationsConsent from "@/components/applications/ApplicationsConsent";
import FormField from "@/components/ui/FormField";
import RichTextEditor from "@/components/applications/RichTextEditor";
import PhotoUpload from "@/components/applications/PhotoUpload";
import SubmitSection from "@/components/applications/SubmitSection";

type LocalImage = { file: File; url: string };

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
  progressPercentage: number;
  filledFields: number;
  totalFields: number;
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
  setTrustAcknowledged: (v: boolean) => void;
  policiesAccepted: boolean;
  setPoliciesAccepted: (v: boolean) => void;
  ackError: boolean;
  trustSupportNotice?: ReactNode;
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
    progressPercentage,
    filledFields,
    totalFields,
    limits,
    amountInputRef,
    trustAcknowledged,
    setTrustAcknowledged,
    policiesAccepted,
    setPoliciesAccepted,
    ackError,
    trustSupportNotice,
  } = props;

  useEffect(() => {
    if (!err || !firstErrorKey || typeof document === "undefined") return;
    const el = document.getElementById(`application-field-${firstErrorKey}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [err, firstErrorKey, validationScrollTrigger]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6 sm:space-y-8"
    >
      <form
        className="grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit(e);
        }}
        onFocusCapture={() => {
          if (!trustAcknowledged && !policiesAccepted) return;
        }}
      >
        {/* Honeypot (anti-spam): bots often fill hidden fields */}
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

        <ApplicationsProgress
          title={title}
          summary={summary}
          story={story}
          amount={amountFormatted}
          payment={payment}
          photos={photos}
          progressPercentage={progressPercentage}
          filledFields={filledFields}
          totalFields={totalFields}
        />

        <div
          id="application-field-title"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.title &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <FormField
            type="input"
            label="Заголовок"
            icon="Home"
            value={title}
            onChange={setTitle}
            placeholder="Краткое описание вашей ситуации..."
            hint={`Краткий заголовок, который привлечет внимание (макс. ${limits.titleMax} символов)`}
            maxLength={limits.titleMax}
            delay={0.1}
            required={true}
            error={fieldErrors?.title}
          />
        </div>

        <div
          id="application-field-summary"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.summary &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <FormField
            type="input"
            label="Краткое описание"
            icon="MessageCircle"
            value={summary}
            onChange={setSummary}
            placeholder="Короткое название заявки (3–10 слов)"
            hint={`Краткое описание, видно в списке заявок (макс. ${limits.summaryMax} символов)`}
            maxLength={limits.summaryMax}
            delay={0.2}
            required={true}
            error={fieldErrors?.summary}
          />
        </div>

        <div
          id="application-field-story"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.story &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "#abd1c6" }}
          >
            Подробная история *
          </label>
          <p className="text-xs text-[#abd1c6]/70 mb-3">
            Подробное описание ситуации (минимум {limits.storyMin}, максимум{" "}
            {limits.storyMax} символов). Используйте кнопки для форматирования
            текста. Вставка запрещена: введите текст вручную.
          </p>
          <RichTextEditor
            value={story}
            onChange={setStory}
            placeholder="Расскажите подробно о вашей ситуации, что привело к необходимости помощи, как планируете использовать средства..."
            minLength={limits.storyMin}
            maxLength={limits.storyMax}
            rows={8}
            allowLinks={false}
            required={true}
            error={fieldErrors?.story}
          />
        </div>

        <div
          id="application-field-amount"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.amount &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <FormField
            type="input"
            label="Сумма запроса"
            icon="DollarSign"
            value={amountFormatted}
            onChange={() => {}}
            placeholder="Укажите сумму в рублях..."
            hint={`Минимальная сумма — ${limits.amountMin} ₽. ${trustHint}`.trim()}
            maxLength={7}
            inputProps={{
              type: "tel",
              inputMode: "numeric",
              autoComplete: "off",
              ref: amountInputRef,
              onChange: handleAmountInputChange,
              max: trustLimitsMax,
            }}
            delay={0.4}
            required={true}
            error={fieldErrors?.amount}
          />
        </div>

        <div
          id="application-field-bankName"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.bankName &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <FormField
            type="input"
            label="Банк"
            icon="CreditCard"
            value={bankName}
            onChange={setBankName}
            placeholder="Название банка (например, Тинькофф, Сбер)"
            hint="Укажите банк получателя отдельно от реквизитов."
            maxLength={15}
            delay={0.45}
            required={true}
            error={fieldErrors?.bankName}
          />
        </div>

        <div
          id="application-field-payment"
          className={cn(
            "rounded-2xl p-4 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.payment &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <FormField
            type="textarea"
            label="Реквизиты для получения помощи"
            icon="CreditCard"
            value={payment}
            onChange={setPayment}
            placeholder="Банковские реквизиты, номер карты или другие способы получения средств"
            hint={`⚠️ Переводы на карты Visa/Mastercard недоступны — используйте МИР/СБП/счёт. Реквизиты для перевода средств (минимум ${limits.paymentMin}, максимум ${limits.paymentMax} символов).`}
            minLength={limits.paymentMin}
            maxLength={limits.paymentMax}
            compact={true}
            delay={0.5}
            required={true}
            error={fieldErrors?.payment}
          />
        </div>

        <div
          id="application-field-photos"
          className={cn(
            "rounded-2xl p-2 -mx-1 transition-all duration-300 border border-transparent",
            fieldErrors?.photos &&
              "border-[#e16162]/50 bg-[#e16162]/8"
          )}
        >
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
            maxPhotos={limits.maxPhotos}
            delay={0.5}
            error={fieldErrors?.photos}
          />
        </div>

        <ApplicationsConsent
          trustAcknowledged={trustAcknowledged}
          setTrustAcknowledged={setTrustAcknowledged}
          policiesAccepted={policiesAccepted}
          setPoliciesAccepted={setPoliciesAccepted}
          ackError={ackError}
        />

        {trustSupportNotice}

        <SubmitSection
          submitting={submitting}
          uploading={uploading}
          left={left}
          err={
            err && fieldErrors && Object.keys(fieldErrors).length > 0
              ? "Исправьте отмеченные поля выше"
              : err
          }
          onSubmit={(e) => {
            e.preventDefault();
            submit(e);
          }}
        />
      </form>
    </motion.div>
  );
}

export default ApplicationsForm;
