"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import type { ApplicationCategory } from "@prisma/client";
import { isApplicationCategory } from "@/lib/applications/categories";

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
import { getMessageFromApiJson } from "@/lib/api/parseApiError";
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

  const [category, setCategory] = useState<ApplicationCategory | "">("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
  const [bankName, setBankName] = useState("");
  const [photos, setPhotos] = useState<LocalImage[]>([]);
  const [reportPhotos, setReportPhotos] = useState<LocalImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [trustAck1, setTrustAck1] = useState(false);
  const [trustAck2, setTrustAck2] = useState(false);
  const [trustAck3, setTrustAck3] = useState(false);
  const [policiesAccepted, setPoliciesAccepted] = useState(false);
  const trustAcknowledged = trustAck1 && trustAck2 && trustAck3;
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
  const storyFirstEditAtRef = useRef<number | null>(null);
  const storyLastEditAtRef = useRef<number | null>(null);

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
    trustAckKey,
    policyAckKey,
    introAckKey,
    loadingAuth,
    setTrustAck1,
    setTrustAck2,
    setTrustAck3,
    setPoliciesAccepted,
    setIntroOpen,
    setIntroChecked,
  });

  usePersistForm({
    trustAckKey,
    policyAckKey,
    introAckKey,
    title,
    summary,
    story,
    amount,
    payment,
    bankName,
    trustAck1,
    trustAck2,
    trustAck3,
    policiesAccepted,
    introChecked,
    formStartedAtRef,
  });

  useIntroOverflow(introOpen);

  // Окно условий теперь показываем при каждом заходе на /applications
  // для авторизованного пользователя.
  useEffect(() => {
    if (!loadingAuth && user) {
      setIntroOpen(true);
    }
  }, [loadingAuth, user]);

  useEffect(() => {
    if (loadingAuth) return;
    const wasSubmitted = consumePendingSubmissionSuccess();
    if (!wasSubmitted) return;
    setSubmitted(true);
    setPhotos([]);
    setReportPhotos([]);
    setCategory("");
    setTitle("");
    setSummary("");
    setStory("");
    setAmount("");
    setPayment("");
    setBankName("");
    setTrustAck1(false);
    setTrustAck2(false);
    setTrustAck3(false);
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
    pendingReviewApplication,
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
  const requiresReport =
    approvedCount !== null && approvedCount >= 1;

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
        category,
        title,
        summary,
        storyTextLen,
        amount,
        amountInt,
        bankName,
        payment,
        photosCount: photos.length,
        reportPhotosCount: reportPhotos.length,
        requiresReport,
        isAdmin,
        withinTrustRange,
      }),
    [
      category,
      title,
      summary,
      storyTextLen,
      amount,
      amountInt,
      bankName,
      payment,
      photos.length,
      reportPhotos.length,
      requiresReport,
      isAdmin,
      withinTrustRange,
    ],
  );
  const filledFields = useMemo(
    () =>
      getFilledFieldsCount({
        category,
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
      category,
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
        category,
        title,
        summary,
        storyTextLen,
        amount,
        amountInt,
        bankName,
        payment,
        photosCount: photos.length,
        reportPhotosCount: reportPhotos.length,
        requiresReport,
        isAdmin,
        withinTrustRange,
      }),
    [
      category,
      title,
      summary,
      storyTextLen,
      amount,
      amountInt,
      bankName,
      payment,
      photos.length,
      reportPhotos.length,
      requiresReport,
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
    if (!trustAcknowledged || !policiesAccepted) {
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

    if (!isApplicationCategory(category)) {
      setErr("Выберите категорию помощи");
      setValidationScrollTrigger((n) => n + 1);
      return false;
    }

    return true;
  }, [
    user,
    trustAcknowledged,
    policiesAccepted,
    photos.length,
    valid,
    category,
  ]);

  const executeSubmit = useCallback(async () => {
    const categorySubmit = category;
    if (!isApplicationCategory(categorySubmit)) {
      setErr("Выберите категорию помощи");
      return;
    }

      try {
        setSubmitting(true);
        setUploading(true);
        const urls = await uploadApplicationPhotos(photos);
        const reportUrls = await uploadApplicationPhotos(reportPhotos);

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
        const paymentPayload = bankName
          ? `Банк: ${bankName}\n${payment}`
          : payment;

        const pendingPayload = {
          category: categorySubmit,
          title,
          summary,
          story,
          amount,
          payment: paymentPayload,
          images: urls,
          reportImages: reportUrls,
          hpCompany,
          acknowledgedRules: trustAcknowledged && policiesAccepted,
          clientMeta: { filledMs, storyEditMs },
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
              "Необходимо оставить отзыв перед созданием следующей заявки",
            ),
          );
        }
        if (r.status === 403 && (d?.requiresActivity as boolean)) {
          savePendingApplication(pendingPayload);
          setActivityModal({
            isOpen: true,
            activityType:
              (d?.activityType as ActivityModalState["activityType"]) ??
              "LIKE_STORY",
            message: getMessageFromApiJson(
              d,
              "Для создания заявки требуется активность",
            ),
          });
          setErr(null);
          return;
        }
        if (r.status === 429) {
          if (typeof d?.leftMs === "number") {
            setLeft(d.leftMs as number);
            throw new Error("Лимит: 1 заявка в 24 часа");
          }
          throw new Error(
            getMessageFromApiJson(d, "Превышен лимит. Попробуйте позже."),
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
        setPhotos([]);
        setReportPhotos([]);
        setCategory("");
        setTitle("");
        setSummary("");
        setStory("");
        setAmount("");
        setPayment("");
        setBankName("");
        setTrustAck1(false);
        setTrustAck2(false);
        setTrustAck3(false);
        setPoliciesAccepted(false);
        setAckError(false);
        clearFormStorage(saveKey, trustAckKey, policyAckKey, formStartKey);
      } catch (e: unknown) {
        setErr(e instanceof Error ? e.message : "Ошибка");
      } finally {
        setSubmitting(false);
        setUploading(false);
      }
  }, [
    category,
    photos,
    reportPhotos,
    storyTextLen,
    title,
    summary,
    story,
    amount,
    bankName,
    payment,
    hpCompany,
    trustAcknowledged,
    policiesAccepted,
    saveKey,
    trustAckKey,
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
    introAckKey,
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
    amount,
    setAmount,
    amountFormatted,
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
    setSubmitted,
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
    approvedCount,
    pendingReviewApplication,
    requiresReview: Boolean(pendingReviewApplication),
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
    validateSubmit,
    executeSubmit,
    submit,
    formStartedAtRef,
    formStartKey,
    handleAmountInputChange,
    activityModal,
    setActivityModal,
  };
}
