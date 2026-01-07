"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Notification } from "@/components/notifications/types";
import { LucideIcons } from "@/components/ui/LucideIcons";

const LS_KEY_LAST_SHOWN = "application_status_last_shown_at";

function safeGetLastShownMs(): number {
  try {
    const raw = localStorage.getItem(LS_KEY_LAST_SHOWN);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function safeSetLastShownMs(ms: number) {
  try {
    localStorage.setItem(LS_KEY_LAST_SHOWN, String(ms));
  } catch {
    // ignore
  }
}

function toMs(dateLike: string): number {
  const ms = new Date(dateLike).getTime();
  return Number.isFinite(ms) ? ms : 0;
}

export default function ApplicationStatusModalGate() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const pollingRef = useRef<number | null>(null);
  const fetchingRef = useRef(false);
  const mountedRef = useRef(false);

  const title = useMemo(() => notification?.title || "Обновление по заявке", [notification?.title]);
  const message = useMemo(() => notification?.message || "", [notification?.message]);
  const timeAgo = useMemo(() => notification?.timestamp || "", [notification?.timestamp]);
  const adminComment = useMemo(
    () => (typeof notification?.adminComment === "string" ? notification.adminComment.trim() : ""),
    [notification?.adminComment],
  );
  const isApproved = notification?.type === "application_status" && notification?.status === "APPROVED";

  const close = () => {
    if (notification?.createdAt) {
      safeSetLastShownMs(toMs(notification.createdAt));
    } else {
      safeSetLastShownMs(Date.now());
    }
    setOpen(false);
  };

  const goToTarget = () => {
    if (notification?.type === "application_status" && notification.applicationId) {
      if (notification.status === "APPROVED") {
        router.push(`/stories/${notification.applicationId}`);
      } else {
        router.push("/applications");
      }
    }
    close();
  };

  const pickNewestUnshown = (items: Notification[]): Notification | null => {
    const lastShown = safeGetLastShownMs();
    const candidates = items
      .filter((n) => n.type === "application_status" && n.applicationId && n.createdAt)
      .sort((a, b) => toMs(b.createdAt) - toMs(a.createdAt));
    const newest = candidates[0];
    if (!newest) return null;
    const newestMs = toMs(newest.createdAt);
    if (newestMs <= lastShown) return null;
    return newest;
  };

  const check = async (silent = true) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const controller = new AbortController();
      const t = window.setTimeout(() => controller.abort(), 2500);

      const r = await fetch("/api/notifications", {
        cache: "no-store",
        signal: controller.signal,
      }).finally(() => window.clearTimeout(t));

      // Не авторизован — просто выходим
      if (r.status === 401) return;
      if (!r.ok) return;

      const d = await r.json().catch(() => null);
      const items = (d?.notifications || []) as Notification[];
      const newest = pickNewestUnshown(items);
      if (!newest) return;

      // Если уже показываем — не перебиваем
      if (open) return;

      setNotification(newest);
      setOpen(true);
    } catch (e) {
      if (!silent && process.env.NODE_ENV !== "production") {
        console.warn("ApplicationStatusModalGate: failed to fetch notifications", e);
      }
    } finally {
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Быстрая проверка после загрузки
    check(true);

    // Периодическая проверка
    pollingRef.current = window.setInterval(() => {
      check(true);
    }, 30000) as unknown as number;

    // При возврате на вкладку
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        check(true);
      }
    };
    const onFocus = () => check(true);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      if (pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Блокируем скролл страницы пока модалка открыта
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Закрытие по Escape (подписка зависит от open, чтобы не держать лишний обработчик)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <AnimatePresence>
      {open && notification ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
            onClick={close}
          >
            <div className="absolute inset-0 bg-black/65" />

            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative w-full max-w-[720px] rounded-2xl border border-[#2c4f45]/70 bg-[#0f2622] shadow-xl p-5 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${
                      isApproved
                        ? "bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]"
                        : "bg-[#e16162]/15 border-[#e16162]/30 text-[#e16162]"
                    }`}
                  >
                    {isApproved ? (
                      <LucideIcons.CheckCircle className="w-5 h-5" />
                    ) : (
                      <LucideIcons.XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#9bb3ab]">
                      Обновление по заявке
                    </p>
                    <h3 className="mt-1 text-lg sm:text-xl font-semibold text-[#f7fbf9] leading-tight">
                      {title}
                    </h3>
                    {timeAgo ? (
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-[#9bb3ab]">
                        <LucideIcons.Clock className="w-3.5 h-3.5" />
                        <span>{timeAgo}</span>
                      </div>
                    ) : null}
                    <p className="mt-2 text-sm sm:text-base text-[#cfdcd6] leading-relaxed">
                      {message}
                    </p>
                    {adminComment ? (
                      <div className="mt-3 rounded-xl border border-[#2c4f45]/70 bg-[#0e2420] p-3">
                        <div className="text-xs uppercase tracking-[0.12em] text-[#9bb3ab]">
                          Комментарий администратора
                        </div>
                        <div className="mt-1 text-sm text-[#e9f4ef] leading-relaxed max-h-[28vh] overflow-y-auto pr-1 break-all whitespace-pre-wrap">
                          {adminComment}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={close}
                  className="p-2 rounded-xl hover:bg-white/5 text-[#9bb3ab] hover:text-[#f7fbf9] transition-colors flex-shrink-0"
                  aria-label="Закрыть"
                >
                  <LucideIcons.X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={close}
                  className="px-4 py-2.5 rounded-xl border border-[#2c4f45]/70 bg-[#0e2420] text-[#cfdcd6] hover:text-[#f7fbf9] hover:border-[#2c4f45] transition-colors"
                >
                  Понятно
                </button>
                <button
                  onClick={goToTarget}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-colors ${
                    isApproved
                      ? "bg-[#10B981] text-[#001e1d] hover:bg-[#0ea371]"
                      : "bg-[#e16162] text-[#fffffe] hover:bg-[#d55556]"
                  }`}
                >
                  {isApproved ? "Открыть историю" : "Открыть заявки"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}


