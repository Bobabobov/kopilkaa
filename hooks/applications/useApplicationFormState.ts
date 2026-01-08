"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { getTrustLevelFromApprovedCount, getTrustLimits, TrustLevel } from "@/lib/trustLevel";

type LocalImage = { file: File; url: string };
type UserShape = { id: string; email?: string | null; role?: "USER" | "ADMIN" };

const SAVE_KEY_BASE = "application_form_data";
const TRUST_ACK_KEY_BASE = "application_trust_ack";
const POLICY_ACK_KEY_BASE = "application_policy_ack";
const INTRO_ACK_KEY_BASE = "application_intro_ack";
const FORM_START_KEY_BASE = "application_form_started_at";

const LIMITS = {
  titleMax: 40,
  summaryMax: 140,
  storyMin: 10,
  storyMax: 3000,
  amountMin: 50,
  amountMax: 5000,
  paymentMin: 10,
  paymentMax: 200,
  maxPhotos: 5,
};

const UPLOAD_LIMITS = {
  maxFileBytes: 5 * 1024 * 1024,
  maxTotalBytes: 10 * 1024 * 1024,
};

export function useApplicationFormState() {
  const [user, setUser] = useState<UserShape | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [story, setStory] = useState("");
  const [amount, setAmount] = useState("");
  const [payment, setPayment] = useState("");
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
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const isAdmin = user?.role === "ADMIN";

  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const [hpCompany, setHpCompany] = useState("");
  const formStartedAtRef = useRef<number | null>(null);

  const storageSuffix = user?.id ?? "anon";
  const saveKey = useMemo(() => `${SAVE_KEY_BASE}:${storageSuffix}`, [storageSuffix]);
  const trustAckKey = useMemo(() => `${TRUST_ACK_KEY_BASE}:${storageSuffix}`, [storageSuffix]);
  const policyAckKey = useMemo(() => `${POLICY_ACK_KEY_BASE}:${storageSuffix}`, [storageSuffix]);
  const introAckKey = useMemo(() => `${INTRO_ACK_KEY_BASE}:${storageSuffix}`, [storageSuffix]);
  const formStartKey = useMemo(() => `${FORM_START_KEY_BASE}:${storageSuffix}`, [storageSuffix]);

  useEffect(() => {
    const getLoc = () => {
      if (typeof window === "undefined") {
        return { pathname: "/applications", search: "" };
      }
      return { pathname: window.location.pathname, search: window.location.search };
    };

    const maybeRedirectToAuth = () => {
      const { pathname, search } = getLoc();
      const params = new URLSearchParams(search);
      const modalParam = params.get("modal") || "";
      const isAuthModal = modalParam.startsWith("auth");
      if (isAuthModal) return;

      const href = buildAuthModalUrl({
        pathname,
        search,
        modal: "auth/signup",
      });
      window.location.href = href;
    };

    fetch("/api/profile/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          maybeRedirectToAuth();
          return;
        }
        setUser(d.user);
      })
      .catch(() => {
        maybeRedirectToAuth();
      })
      .finally(() => setLoadingAuth(false));
  }, []);

  useEffect(() => {
    if (loadingAuth) return;
    try {
      const saved = localStorage.getItem(saveKey);
      const trustAck = sessionStorage.getItem(trustAckKey);
      const policyAck = sessionStorage.getItem(policyAckKey);
      const introAck = sessionStorage.getItem(introAckKey) ?? localStorage.getItem(introAckKey);
      const savedStart = localStorage.getItem(formStartKey);

      if (saved) {
        const data = JSON.parse(saved);
        setTitle(data.title ?? "");
        setSummary(data.summary ?? "");
        setStory(data.story ?? "");
        setAmount(data.amount ?? "");
        setPayment(data.payment ?? "");
      } else {
        setTitle("");
        setSummary("");
        setStory("");
        setAmount("");
        setPayment("");
      }

      if (savedStart && !Number.isNaN(Number(savedStart))) {
        formStartedAtRef.current = Number(savedStart);
      } else {
        // если нет сохранённого времени старта — считаем началом текущий момент
        formStartedAtRef.current = Date.now();
        localStorage.setItem(formStartKey, String(formStartedAtRef.current));
      }

      setTrustAcknowledged(trustAck === "true");
      setPoliciesAccepted(policyAck === "true");

      if (introAck === "true") {
        setIntroOpen(false);
        setIntroChecked(true);
      } else {
        setIntroOpen(true);
        setIntroChecked(false);
      }
    } catch (error) {
      console.log("Ошибка при восстановлении данных:", error);
    }
  }, [saveKey, trustAckKey, policyAckKey, introAckKey, formStartKey, loadingAuth]);

  useEffect(() => {
    const data = { title, summary, story, amount, payment };
    const t = window.setTimeout(() => {
      try {
        localStorage.setItem(saveKey, JSON.stringify(data));
        sessionStorage.setItem(trustAckKey, trustAcknowledged ? "true" : "false");
        sessionStorage.setItem(policyAckKey, policiesAccepted ? "true" : "false");
        if (introChecked) {
          sessionStorage.setItem(introAckKey, "true");
          localStorage.setItem(introAckKey, "true");
        }
        if (formStartedAtRef.current) {
          localStorage.setItem(formStartKey, String(formStartedAtRef.current));
        }
      } catch (error) {
        console.log("Ошибка при сохранении данных:", error);
      }
    }, 250);
    return () => window.clearTimeout(t);
  }, [
    title,
    summary,
    story,
    amount,
    payment,
    trustAcknowledged,
    policiesAccepted,
    introChecked,
    saveKey,
    trustAckKey,
    policyAckKey,
    introAckKey,
    formStartKey,
  ]);

  useEffect(() => {
    const html = document.documentElement;
    if (introOpen) {
      document.body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      html.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      html.style.overflow = "";
    };
  }, [introOpen]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/profile/stats", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        const approved =
          d?.approvedApplications ??
          d?.applications?.approved ??
          d?.applications?.approvedApplications;
        if (typeof approved === "number" && approved >= 0) {
          setApprovedCount(approved);
        }
      })
      .catch(() => {});
  }, [user]);

  const storyTextLen = useMemo(() => {
    if (!story) return 0;
    const div = document.createElement("div");
    div.innerHTML = story;
    return (div.textContent || div.innerText || "").replace(/\s/g, "").length;
  }, [story]);

  const trustLevel: TrustLevel = useMemo(
    () => getTrustLevelFromApprovedCount(approvedCount ?? 0),
    [approvedCount],
  );
  const trustLimits = useMemo(() => getTrustLimits(trustLevel), [trustLevel]);
  const trustHint = isAdmin
    ? "Администратор: лимиты суммы не применяются"
    : `Доступная сумма для вашего уровня: до ${trustLimits.max.toLocaleString("ru-RU")} ₽`;
  const amountInt = amount ? parseInt(amount) : NaN;
  const withinTrustRange =
    isAdmin ||
    approvedCount === null ||
    (Number.isFinite(amountInt) && amountInt >= trustLimits.min && amountInt <= trustLimits.max);
  const exceedsTrustLimit =
    !isAdmin && approvedCount !== null && Number.isFinite(amountInt) && amountInt > trustLimits.max;

  const valid =
    title.length > 0 &&
    title.length <= LIMITS.titleMax &&
    summary.length > 0 &&
    summary.length <= LIMITS.summaryMax &&
    storyTextLen >= LIMITS.storyMin &&
    storyTextLen <= LIMITS.storyMax &&
    amount.length > 0 &&
    amountInt >= LIMITS.amountMin &&
    (isAdmin || amountInt <= LIMITS.amountMax) &&
    withinTrustRange &&
    payment.length >= LIMITS.paymentMin &&
    (isAdmin || payment.length <= LIMITS.paymentMax) &&
    photos.length <= LIMITS.maxPhotos;

  const getCharCount = (text: string) => text.replace(/\s/g, "").length;
  const filledFields = [
    getCharCount(title) > 0,
    getCharCount(summary) > 0,
    getCharCount(story) >= LIMITS.storyMin,
    amount.length > 0 && amountInt >= LIMITS.amountMin,
    getCharCount(payment) >= LIMITS.paymentMin,
    photos.length > 0,
  ].filter(Boolean).length;
  const totalFields = 6;
  const progressPercentage = Math.round((filledFields / totalFields) * 100);

  const formatAmountRu = (digits: string) => {
    if (!digits) return "";
    const n = Number(digits);
    if (!Number.isFinite(n)) return digits;
    return n.toLocaleString("ru-RU");
  };

  const countDigits = (s: string) => (s.match(/\d/g) || []).length;

  const caretPosForDigitIndex = (formatted: string, digitIndex: number) => {
    if (digitIndex <= 0) return 0;
    let seen = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        seen++;
        if (seen >= digitIndex) return i + 1;
      }
    }
    return formatted.length;
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    const digitsBeforeCaret = countDigits(raw.slice(0, caret));
    const nextDigits = raw.replace(/[^\d]/g, "");
    let clampedDigits = "";
    if (nextDigits.length > 0) {
      const numeric = parseInt(nextDigits, 10);
      if (Number.isFinite(numeric)) {
        clampedDigits = (isAdmin ? numeric : Math.min(numeric, trustLimits.max)).toString();
      }
    }

    setAmount(clampedDigits);

    requestAnimationFrame(() => {
      const el = amountInputRef.current;
      if (!el) return;
      const nextFormatted = formatAmountRu(clampedDigits);
      const safeDigitsBefore = Math.min(digitsBeforeCaret, countDigits(nextFormatted));
      const nextCaret = caretPosForDigitIndex(nextFormatted, safeDigitsBefore);
      try {
        el.setSelectionRange(nextCaret, nextCaret);
      } catch {
        // ignore
      }
    });
  };

  const uploadAll = async (): Promise<string[]> => {
    if (!photos.length) return [];
    setUploading(true);
    try {
      const fd = new FormData();
      const filesToUpload: File[] = [];

      photos.forEach((item) => {
        let file: File;
        if (item instanceof File) {
          file = item;
        } else if (item && item.file instanceof File) {
          file = item.file;
        } else {
          return;
        }
        filesToUpload.push(file);
      });

      const tooBig = filesToUpload.find((f) => f.size > UPLOAD_LIMITS.maxFileBytes);
      if (tooBig) {
        throw new Error(`Файл "${tooBig.name}" слишком большой. Максимум: 5 МБ на фото.`);
      }
      const totalBytes = filesToUpload.reduce((sum, f) => sum + f.size, 0);
      if (totalBytes > UPLOAD_LIMITS.maxTotalBytes) {
        const mb = (UPLOAD_LIMITS.maxTotalBytes / (1024 * 1024)).toFixed(0);
        throw new Error(
          `Слишком большой общий размер фото. Максимум: ${mb} МБ на все фото вместе. Уменьшите/замените фото.`,
        );
      }

      filesToUpload.forEach((file) => fd.append("files", file));

      const r = await fetch("/api/uploads", { method: "POST", body: fd });
      const contentType = r.headers.get("content-type") || "";

      if (r.status === 413) {
        throw new Error(
          "Фото слишком большие для загрузки. Уменьшите размер фото и попробуйте снова.",
        );
      }

      const d =
        contentType.includes("application/json") ? await r.json().catch(() => null) : null;
      if (!r.ok) {
        const serverMsg = d?.error || d?.message;
        throw new Error(serverMsg || "Ошибка загрузки фото");
      }
      return ((d?.files as { url: string }[]) || []).map((f) => f.url);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErr(null);

    if (!user) {
      const href = buildAuthModalUrl({
        pathname: typeof window !== "undefined" ? window.location.pathname : "/applications",
        search: typeof window !== "undefined" ? window.location.search : "",
        modal: "auth/signup",
      });
      window.location.href = href;
      return;
    }

    if (!trustAcknowledged || !policiesAccepted) {
      setAckError(true);
      return;
    }
    setAckError(false);

    if (!valid) {
      setErr("Проверьте поля — есть ошибки/лимиты");
      return;
    }

    try {
      setSubmitting(true);
      const urls = await uploadAll();
      if (formStartedAtRef.current == null) {
        formStartedAtRef.current = Date.now();
      }
      const filledMs =
        formStartedAtRef.current != null
          ? Math.max(0, Date.now() - formStartedAtRef.current)
          : null;
      const r = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          summary,
          story,
          amount,
          payment,
          images: urls,
          hpCompany,
          acknowledgedRules: trustAcknowledged && policiesAccepted,
          clientMeta: { filledMs },
        }),
      });
      const d = await r.json();
      if (r.status === 401) {
        const href = buildAuthModalUrl({
          pathname: typeof window !== "undefined" ? window.location.pathname : "/applications",
          search: typeof window !== "undefined" ? window.location.search : "",
          modal: "auth",
        });
        window.location.href = href;
        return;
      }
      if (r.status === 429) {
        if (d?.leftMs) {
          setLeft(d.leftMs);
          throw new Error("Лимит: 1 заявка в 24 часа");
        }
        if (d?.error) {
          throw new Error(d.error);
        }
        throw new Error("Превышен лимит. Попробуйте позже.");
      }
      if (!r.ok) throw new Error(d?.error || "Ошибка отправки");

      setSubmitted(true);
      setPhotos([]);
      setTitle("");
      setSummary("");
      setStory("");
      setAmount("");
      setPayment("");
      setTrustAcknowledged(false);
      setPoliciesAccepted(false);
      setAckError(false);
      localStorage.removeItem(saveKey);
      sessionStorage.removeItem(trustAckKey);
      sessionStorage.removeItem(policyAckKey);
      localStorage.removeItem(formStartKey);
    } catch (e: any) {
      setErr(e.message || "Ошибка");
    } finally {
      setSubmitting(false);
    }
  };

  const amountFormatted = formatAmountRu(amount);

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
    submit,
    formStartedAtRef,
    formStartKey,
    handleAmountInputChange,
  };
}

export { LIMITS };


