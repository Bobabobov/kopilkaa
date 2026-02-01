"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import {
  SAVE_KEY_BASE,
  TRUST_ACK_KEY_BASE,
  POLICY_ACK_KEY_BASE,
  INTRO_ACK_KEY_BASE,
  FORM_START_KEY_BASE,
  LIMITS,
  TOTAL_FIELDS,
} from "./constants";
import type { LocalImage } from "./types";
import { useApplicationFormAuth } from "./useAuth";
import { useRestoreForm, usePersistForm } from "./usePersistence";
import { useIntroOverflow } from "./useIntroOverflow";
import { useTrustAndReview } from "./useTrustAndReview";
import {
  getStoryTextLen,
  isApplicationFormValid,
  getFilledFieldsCount,
  getProgressPercentage,
  getApplicationFormErrors,
  type ApplicationFieldKey,
} from "./validation";
import { formatAmountRu, createHandleAmountInputChange } from "./amountUtils";
import { uploadApplicationPhotos } from "./upload";
import { postApplication } from "./submitApi";
import { clearFormStorage } from "./storage";
import type { ActivityModalState } from "./types";
import {
  consumePendingSubmissionSuccess,
  savePendingApplication,
} from "@/lib/applications/pendingSubmission";

export function useApplicationFormState() {
  const { user, loadingAuth } = useApplicationFormAuth();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [bankName, setBankName] = useState("");
  const [photos, setPhotos] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trustAcknowledged, setTrustAcknowledged] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const [ackError, setAckError] = useState(false);
  const [introOpen, setIntroOpen] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);
  const [hpCompany, setHpCompany] = useState("");
  const [activityModal, setActivityModal] = useState<ActivityModalState>({
    isOpen: false,
    activityType: null,
    message: "",
  });
  const [validationScrollTrigger, setValidationScrollTrigger] = useState(0);

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const formStartedAtRef = useRef<number | null>(null);

  const storageSuffix = user?.id ?? "anon";
  const saveKey = useMemo(
    () => `${SAVE_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const trustAckKey = useMemo(
    () => `${TRUST_ACK_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const policyAckKey = useMemo(
    () => `${POLICY_ACK_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const introAckKey = useMemo(
    () => `${INTRO_ACK_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const formStartKey = useMemo(
    () => `${FORM_START_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );

  useRestoreForm({
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
    loadingAuth,
    setTitle,
    setSummary,
    setStory,
    setAmount,
    setPayment,
    setBankName,
    setTrustAcknowledged,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
    formStartedAtRef,
  });

  usePersistForm({
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    trustAcknowledged,
    policiesAccepted,
    introChecked,
    formStartedAtRef,
  });

  useIntroOverflow(introOpen);

  useEffect(() => {
    if (loadingAuth) return;
    const wasSubmitted = consumePendingSubmissionSuccess();
    if (!wasSubmitted) return;
    setSubmitted(true);
    setPhotos([]);
    setTitle("");
    setSummary("");
    setStory("");
    setAmount("");
    setPayment("");
    setBankName("");
    setTrustAcknowledged(false);
    setPoliciesAccepted(false);
    setAckError(false);
    setErr(null);
    setLeft(null);
    clearFormStorage(saveKey, trustAckKey, policyAckKey, formStartKey);
  }, [
    loadingAuth,
    saveKey,
    trustAckKey,
    policyAckKey,
    formStartKey,
  ]);

  const trust = useTrustAndReview(user, amount);
  const {
    approvedCount,
    hasReview,
    trustSnapshot,
    trustLevel,
    trustLimits,
    trustHint,
    withinTrustRange,
    exceedsTrustLimit,
    isAdmin,
    amountInt,
  } = trust;

  const storyTextLen = useMemo(() => getStoryTextLen(story), [story]);
  const valid = useMemo(
    () =>
      isApplicationFormValid({
        title,
        summary,
        storyTextLen,
        amount,
        amountInt,
        bankName,
        payment,
        photosCount: photos.length,
        isAdmin,
        withinTrustRange,
      }),
    [
      title,
      summary,
      storyTextLen,
      amount,
      amountInt,
      bankName,
      payment,
      photos.length,
      isAdmin,
      withinTrustRange,
    ],
  );
  const filledFields = useMemo(
    () =>
      getFilledFieldsCount({
        title,
        summary,
        storyTextLen,
        amount,
        amountInt,
        bankName,
        payment,
        photosCount: photos.length,
      }),
    [
      title,
      summary,
      storyTextLen,
      amount,
      amountInt,
      bankName,
      payment,
      photos.length,
    ],
  );
  const progressPercentage = getProgressPercentage(filledFields);
  const totalFields = TOTAL_FIELDS;

  const fieldErrors = useMemo(
    () =>
      getApplicationFormErrors({
        title,
        summary,
        storyTextLen,
        amount,
        amountInt,
        bankName,
        payment,
        photosCount: photos.length,
        isAdmin,
        withinTrustRange,
      }),
    [
      title,
      summary,
      storyTextLen,
      amount,
      amountInt,
      bankName,
      payment,
      photos.length,
      isAdmin,
      withinTrustRange,
    ]
  );
  const firstErrorKey = useMemo(
    () => (Object.keys(fieldErrors)[0] as ApplicationFieldKey | undefined),
    [fieldErrors]
  );

  const handleAmountInputChange = useCallback(
    createHandleAmountInputChange(
      setAmount,
      isAdmin,
      trustLimits.max,
      amountInputRef,
    ),
    [isAdmin, trustLimits.max],
  );

  const amountFormatted = formatAmountRu(amount);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setErr(null);

      if (!user) {
        const href = buildAuthModalUrl({
          pathname:
            typeof window !== "undefined"
              ? window.location.pathname
              : "/applications",
          search: typeof window !== "undefined" ? window.location.search : "",
          modal: "auth/signup",
        });
        if (typeof window !== "undefined") window.location.href = href;
        return;
      }
      if (!trustAcknowledged || !policiesAccepted) {
        setAckError(true);
        return;
      }
      setAckError(false);
      if (photos.length === 0) {
        setErr("Добавьте хотя бы одну фотографию");
        return;
      }
      if (!valid) {
        setErr("Проверьте поля — есть ошибки/лимиты");
        setValidationScrollTrigger((n) => n + 1);
        return;
      }

      try {
        setSubmitting(true);
        setUploading(true);
        const urls = await uploadApplicationPhotos(photos);
        setUploading(false);

        if (formStartedAtRef.current == null) {
          formStartedAtRef.current = Date.now();
        }
        const filledMs =
          formStartedAtRef.current != null
            ? Math.max(0, Date.now() - formStartedAtRef.current)
            : null;
        const paymentPayload = bankName
          ? `Банк: ${bankName}\n${payment}`
          : payment;

        const pendingPayload = {
          title,
          summary,
          story,
          amount,
          payment: paymentPayload,
          images: urls,
          hpCompany,
          acknowledgedRules: trustAcknowledged && policiesAccepted,
          clientMeta: { filledMs },
        };

        const { response: r, data: d } = await postApplication(pendingPayload);

        if (r.status === 401) {
          const href = buildAuthModalUrl({
            pathname:
              typeof window !== "undefined"
                ? window.location.pathname
                : "/applications",
            search: typeof window !== "undefined" ? window.location.search : "",
            modal: "auth",
          });
          window.location.href = href;
          return;
        }
        if (r.status === 403 && (d?.requiresReview as boolean)) {
          throw new Error(
            (d?.error as string) ||
              "Необходимо оставить отзыв перед созданием новой заявки",
          );
        }
        if (r.status === 403 && (d?.requiresActivity as boolean)) {
          savePendingApplication(pendingPayload);
          setActivityModal({
            isOpen: true,
            activityType:
              (d?.activityType as ActivityModalState["activityType"]) ??
              "LIKE_STORY",
            message:
              (d?.error as string) ||
              "Для создания заявки требуется активность",
          });
          setErr(null);
          return;
        }
        if (r.status === 429) {
          if (typeof d?.leftMs === "number") {
            setLeft(d.leftMs as number);
            throw new Error("Лимит: 1 заявка в 24 часа");
          }
          if (d?.error) throw new Error(d.error as string);
          throw new Error("Превышен лимит. Попробуйте позже.");
        }
        if (!r.ok) {
          throw new Error((d?.error as string) || "Ошибка отправки");
        }

        setSubmitted(true);
        setPhotos([]);
        setTitle("");
        setSummary("");
        setStory("");
        setAmount("");
        setPayment("");
        setBankName("");
        setTrustAcknowledged(false);
        setPoliciesAccepted(false);
        setAckError(false);
        clearFormStorage(saveKey, trustAckKey, policyAckKey, formStartKey);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Ошибка");
      } finally {
        setSubmitting(false);
      }
    },
    [
      user,
      trustAcknowledged,
      policiesAccepted,
      photos,
      valid,
      title,
      summary,
      story,
      amount,
      bankName,
      payment,
      hpCompany,
      saveKey,
      trustAckKey,
      policyAckKey,
      formStartKey,
    ],
  );

  return {
    introAckKey,
    user,
    loadingAuth,
    title,
    setTitle,
    summary,
    setSummary,
    story,
    setStory,
    amount,
    setAmount,
    amountFormatted,
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
    setSubmitted,
    trustAcknowledged,
    setTrustAcknowledged,
    policiesAccepted,
    setPoliciesAccepted,
    ackError,
    introOpen,
    setIntroOpen,
    introChecked,
    setIntroChecked,
    approvedCount,
    hasReview,
    requiresReview:
      approvedCount !== null && approvedCount > 0 && hasReview === false,
    trustLevel,
    trustLimits,
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
    formStartedAtRef,
    formStartKey,
    handleAmountInputChange,
    activityModal,
    setActivityModal,
  };
}
