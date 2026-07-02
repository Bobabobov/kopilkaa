"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import type { ApplicationCategory } from "@prisma/client";
import { DEFAULT_APPLICATION_CATEGORY } from "@/lib/applications/categories";

import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { recordFeedbackMeaningfulAction } from "@/lib/feedback/promptStorage";
import {
  SAVE_KEY_BASE,
  RULES_ACK_KEY_BASE,
  POLICY_ACK_KEY_BASE,
  FORM_START_KEY_BASE,
  LIMITS,
  TOTAL_FIELDS,
} from "./constants";
import type { LocalImage } from "./types";
import { useApplicationFormAuth } from "./useAuth";
import { useRestoreForm, usePersistForm } from "./usePersistence";
import { useApplicationReviewStats } from "./useApplicationReviewStats";
import {
  getStoryTextLen,
  isApplicationFormValid,
  getFilledFieldsCount,
  getProgressPercentage,
  getApplicationFormErrors,
  type ApplicationFieldKey,
} from "./validation";
import { formatAmountRu, createHandleAmountInputChange } from "./amountUtils";
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
import { uploadApplicationPhotos } from "./upload";
import { postApplication } from "./submitApi";
import { collectDeviceFingerprint, getClientTimezone } from "@/lib/deviceFingerprint/collect";
import { clearFormStorage } from "./storage";
import { consumePendingSubmissionSuccess } from "@/lib/applications/pendingSubmission";
import type { ApplicationEligibility } from "@/lib/applications/applicationEconomy";
import { getMaxApplicationAmount, showsDesiredAmountField } from "@/lib/level-config";
import { buildSbpPaymentPayload } from "@/lib/sbp/formatPayment";

export function useApplicationFormState() {
  const { user, loadingAuth } = useApplicationFormAuth();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [desiredAmount, setDesiredAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [bankName, setBankName] = useState("");
  const [photos, setPhotos] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [eligibility, setEligibility] = useState<ApplicationEligibility | null>(
    null,
  );
  const [loadingEligibility, setLoadingEligibility] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rulesAck1, setRulesAck1] = useState(false);
  const [rulesAck2, setRulesAck2] = useState(false);
  const [rulesAck3, setRulesAck3] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const rulesAcknowledged = rulesAck1 && rulesAck2 && rulesAck3;
  const [ackError, setAckError] = useState(false);
  const [hpCompany, setHpCompany] = useState("");
  const [validationScrollTrigger, setValidationScrollTrigger] = useState(0);

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const desiredAmountInputRef = useRef<HTMLInputElement | null>(null);
  const formStartedAtRef = useRef<number | null>(null);
  const storyFirstEditAtRef = useRef<number | null>(null);
  const storyLastEditAtRef = useRef<number | null>(null);

  const storageSuffix = user?.id ?? "anon";
  const saveKey = useMemo(
    () => `${SAVE_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const rulesAckKey = useMemo(
    () => `${RULES_ACK_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const policyAckKey = useMemo(
    () => `${POLICY_ACK_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );
  const formStartKey = useMemo(
    () => `${FORM_START_KEY_BASE}:${storageSuffix}`,
    [storageSuffix],
  );

  useEffect(() => {
    if (loadingAuth) return;
    try {
      localStorage.removeItem(saveKey);
      localStorage.removeItem(formStartKey);
    } catch {
      // ignore
    }
  }, [loadingAuth, saveKey, formStartKey]);

  useRestoreForm({
    rulesAckKey,
    policyAckKey,
    loadingAuth,
    setRulesAck1,
    setRulesAck2,
    setRulesAck3,
    setPoliciesAccepted,
  });

  usePersistForm({
    rulesAckKey,
    policyAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    rulesAck1,
    rulesAck2,
    rulesAck3,
    policiesAccepted,
    formStartedAtRef,
  });

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
    setDesiredAmount("");
    setPayment("");
    setBankName("");
    setRulesAck1(false);
    setRulesAck2(false);
    setRulesAck3(false);
    setPoliciesAccepted(false);
    setAckError(false);
    setErr(null);
    setLeft(null);
    clearFormStorage(saveKey, rulesAckKey, policyAckKey, formStartKey);
  }, [
    loadingAuth,
    saveKey,
    rulesAckKey,
    policyAckKey,
    formStartKey,
  ]);

  const { approvedCount, pendingReviewApplication, isAdmin, amountInt } =
    useApplicationReviewStats(user, amount);

  const amountMax = useMemo(() => {
    if (isAdmin) return LIMITS.amountMax;
    return eligibility?.maxApplicationAmount ?? getMaxApplicationAmount(1);
  }, [isAdmin, eligibility?.maxApplicationAmount]);

  const showsDesiredAmount = useMemo(() => {
    if (isAdmin) return true;
    const level = eligibility?.userLevel ?? 1;
    return showsDesiredAmountField(level);
  }, [isAdmin, eligibility?.userLevel]);

  const desiredAmountInt = desiredAmount ? parseInt(desiredAmount, 10) : NaN;

  useEffect(() => {
    if (loadingAuth || !user?.id) {
      setEligibility(null);
      return;
    }

    let cancelled = false;
    setLoadingEligibility(true);

    fetch("/api/applications/eligibility", { cache: "no-store" })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json?.data) return null;
        return json.data as ApplicationEligibility;
      })
      .then((data) => {
        if (cancelled) return;
        setEligibility(data);
        if (data?.cooldownRemainingMs != null && data.cooldownRemainingMs > 0) {
          setLeft(data.cooldownRemainingMs);
        } else {
          setLeft(null);
        }
      })
      .catch(() => {
        if (!cancelled) setEligibility(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingEligibility(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadingAuth, user?.id]);

  const storyTextLen = useMemo(() => getStoryTextLen(story), [story]);

  useEffect(() => {
    if (storyTextLen > 0) {
      const now = Date.now();
      if (storyFirstEditAtRef.current == null) {
        storyFirstEditAtRef.current = now;
      }
      storyLastEditAtRef.current = now;
    }
  }, [story, storyTextLen]);
  const valid = useMemo(
    () =>
      isApplicationFormValid({
        title,
        summary,
        story,
        storyTextLen,
        amount,
        amountInt,
        desiredAmount,
        desiredAmountInt,
        bankName,
        payment,
        photosCount: photos.length,
        isAdmin,
        amountMax,
        showsDesiredAmount,
      }),
    [
      title,
      summary,
      story,
      storyTextLen,
      amount,
      amountInt,
      desiredAmount,
      desiredAmountInt,
      bankName,
      payment,
      photos.length,
      isAdmin,
      amountMax,
      showsDesiredAmount,
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
      story,
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
        story,
        storyTextLen,
        amount,
        amountInt,
        desiredAmount,
        desiredAmountInt,
        bankName,
        payment,
        photosCount: photos.length,
        isAdmin,
        amountMax,
        showsDesiredAmount,
      }),
    [
      title,
      summary,
      story,
      storyTextLen,
      amount,
      amountInt,
      desiredAmount,
      desiredAmountInt,
      bankName,
      payment,
      photos.length,
      isAdmin,
      amountMax,
      showsDesiredAmount,
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
      amountMax,
      amountInputRef,
    ),
    [isAdmin, amountMax],
  );

  const handleDesiredAmountInputChange = useCallback(
    createHandleAmountInputChange(
      setDesiredAmount,
      true,
      LIMITS.amountMax,
      desiredAmountInputRef,
    ),
    [],
  );

  const amountFormatted = formatAmountRu(amount);
  const desiredAmountFormatted = formatAmountRu(desiredAmount);

  /** Проверки перед отправкой (без загрузки файлов и без API). */
  const validateSubmit = useCallback((): boolean => {
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
      return false;
    }
    if (!rulesAcknowledged || !policiesAccepted) {
      setAckError(true);
      return false;
    }
    setAckError(false);
    if (photos.length === 0) {
      setErr("Добавьте хотя бы одну фотографию");
      return false;
    }
    if (!valid) {
      setErr("Проверьте поля — есть ошибки/лимиты");
      setValidationScrollTrigger((n) => n + 1);
      return false;
    }

    return true;
  }, [
    user,
    rulesAcknowledged,
    policiesAccepted,
    photos.length,
    valid,
  ]);

  const executeSubmit = useCallback(async () => {
    const categorySubmit: ApplicationCategory = DEFAULT_APPLICATION_CATEGORY;

      try {
        setSubmitting(true);
        setUploading(true);
        const urls = await uploadApplicationPhotos(photos);

        if (formStartedAtRef.current == null) {
          formStartedAtRef.current = Date.now();
        }
        const filledMs =
          formStartedAtRef.current != null
            ? Math.max(0, Date.now() - formStartedAtRef.current)
            : null;
        const storyEditMs =
          storyFirstEditAtRef.current != null &&
          storyLastEditAtRef.current != null &&
          storyTextLen > 0
            ? Math.max(
                0,
                storyLastEditAtRef.current - storyFirstEditAtRef.current,
              )
            : null;
        const paymentPayload = buildSbpPaymentPayload(bankName, payment);
        const deviceFingerprint = await collectDeviceFingerprint();
        const clientTimezone = getClientTimezone();

        const pendingPayload = {
          category: categorySubmit,
          title,
          summary,
          story,
          amount,
          ...(showsDesiredAmount &&
          desiredAmount &&
          desiredAmountInt > amountInt
            ? { desiredAmount }
            : {}),
          payment: paymentPayload,
          images: urls,
          hpCompany,
          acknowledgedRules: rulesAcknowledged && policiesAccepted,
          clientMeta: { filledMs, storyEditMs, deviceFingerprint, clientTimezone },
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
            getMessageFromApiJson(
              d,
              "Необходимо оставить отзыв перед публикацией следующей истории",
            ),
          );
        }
        if (r.status === 429) {
          if (typeof d?.leftMs === "number") {
            setLeft(d.leftMs as number);
          }
          throw new Error(
            getMessageFromApiJson(
              d,
              "Следующую историю можно опубликовать позже",
            ),
          );
        }
        if (!r.ok) {
          const main = getMessageFromApiJson(d, "Ошибка отправки");
          const detail =
            typeof d?.detail === "string" && d.detail.length > 0
              ? d.detail
              : null;
          throw new Error(detail ? `${main} ${detail}` : main);
        }

        setSubmitted(true);
        recordFeedbackMeaningfulAction();
        void fetch("/api/applications/eligibility", { cache: "no-store" })
          .then(async (res) => {
            const json = await res.json().catch(() => ({}));
            if (res.ok && json?.data) {
              setEligibility(json.data as ApplicationEligibility);
            }
          })
          .catch(() => undefined);
        setPhotos([]);
        setTitle("");
        setSummary("");
        setStory("");
        setAmount("");
    setDesiredAmount("");
        setPayment("");
        setBankName("");
        setRulesAck1(false);
        setRulesAck2(false);
        setRulesAck3(false);
        setPoliciesAccepted(false);
        setAckError(false);
        clearFormStorage(saveKey, rulesAckKey, policyAckKey, formStartKey);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Ошибка");
      } finally {
        setSubmitting(false);
        setUploading(false);
      }
  }, [
    photos,
    storyTextLen,
    title,
    summary,
    story,
    amount,
    desiredAmount,
    desiredAmountInt,
    showsDesiredAmount,
    bankName,
    payment,
    hpCompany,
    rulesAcknowledged,
    policiesAccepted,
    saveKey,
    rulesAckKey,
    policyAckKey,
    formStartKey,
  ]);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateSubmit()) return;
      await executeSubmit();
    },
    [validateSubmit, executeSubmit],
  );

  return {
    user,
    loadingAuth,
    isAdmin,
    title,
    setTitle,
    summary,
    setSummary,
    story,
    setStory,
    amount,
    setAmount,
    amountFormatted,
    desiredAmount,
    setDesiredAmount,
    desiredAmountFormatted,
    showsDesiredAmount,
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
    eligibility,
    loadingEligibility,
    amountMax,
    submitted,
    setSubmitted,
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
    approvedCount,
    pendingReviewApplication,
    requiresReview: Boolean(pendingReviewApplication),
    amountInputRef,
    desiredAmountInputRef,
    hpCompany,
    setHpCompany,
    progressPercentage,
    filledFields,
    totalFields,
    valid,
    fieldErrors,
    firstErrorKey,
    validationScrollTrigger,
    validateSubmit,
    executeSubmit,
    submit,
    formStartedAtRef,
    formStartKey,
    handleAmountInputChange,
    handleDesiredAmountInputChange,
  };
}
