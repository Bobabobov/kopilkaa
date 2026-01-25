"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { LoginView } from "./LoginView";
import { SignupView } from "./SignupView";
import { AuthModeSwitcher } from "./AuthModeSwitcher";

type AuthMode = "login" | "signup";

interface AuthModalProps {
  mode: AuthMode;
  checkingAuth: boolean;
  onTelegramAuth: (user: any) => Promise<void>;
  onGoogleAuth: (data: any) => Promise<void>;
  onEmailLogin: (identifier: string, password: string) => Promise<void>;
  onEmailSignup: (
    email: string,
    name: string,
    password: string,
  ) => Promise<void>;
  busy: boolean;
  error: string | null;
}

export function AuthModal({
  mode,
  checkingAuth,
  onTelegramAuth,
  onGoogleAuth,
  onEmailLogin,
  onEmailSignup,
  busy,
  error,
}: AuthModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const showEmailForm =
    modal === "auth/login/email" || modal === "auth/signup/email";
  const isSignup = mode === "signup";
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  const getSafeNext = (nextValue: string | null): string | null => {
    if (!nextValue) return null;
    let decoded = nextValue;
    try {
      decoded = decodeURIComponent(nextValue);
    } catch {
      // keep raw
    }
    const v = String(decoded).trim();
    if (!v.startsWith("/")) return null;
    if (v.startsWith("//")) return null;
    if (v.includes("://")) return null;
    if (v.includes("\n") || v.includes("\r")) return null;
    return v;
  };

  const closeModal = () => {
    const safeNext = getSafeNext(searchParams.get("next"));
    if (safeNext) {
      router.replace(safeNext);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("modal");
    params.delete("next");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    const nextUrl = params.toString()
      ? `${pathname}?${params.toString()}`
      : pathname;
    router.replace(nextUrl);
  };

  // UX: закрытие по Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Accessibility: focus trap inside dialog + restore focus on unmount
  useEffect(() => {
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;

    const dialog = dialogRef.current;
    const getFocusable = () => {
      if (!dialog) return [] as HTMLElement[];
      const nodes = dialog.querySelectorAll<HTMLElement>(
        [
          "a[href]",
          "button:not([disabled])",
          "textarea:not([disabled])",
          "input:not([disabled])",
          "select:not([disabled])",
          "[tabindex]:not([tabindex='-1'])",
        ].join(","),
      );
      return Array.from(nodes).filter((el) => {
        const style = window.getComputedStyle(el);
        const hidden =
          style.display === "none" ||
          style.visibility === "hidden" ||
          el.getAttribute("aria-hidden") === "true";
        return !hidden;
      });
    };

    // initial focus
    const focusables = getFocusable();
    const initial = focusables[0] || dialog;
    if (initial) {
      // wait a tick for motion layout
      setTimeout(() => initial.focus(), 0);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = getFocusable();
      if (!dialog) return;

      if (focusables.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = !!active && dialog.contains(active);

      if (e.shiftKey) {
        if (!inside || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (!inside || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // restore focus back to the trigger if still in DOM
      try {
        lastActiveElementRef.current?.focus?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={closeModal}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-lg p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8,
          }}
          onClick={(e) => e.stopPropagation()}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          aria-describedby="auth-modal-desc"
          tabIndex={-1}
          className="relative w-full max-w-[520px] rounded-3xl bg-[#001e1d] border border-[#1f2937]/50 shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Декоративные элементы */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#f9bc60]/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-[#abd1c6]/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

          {/* Кнопка закрытия */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeModal}
            className="absolute right-4 top-4 w-9 h-9 flex items-center justify-center text-[#9ca3af] hover:text-[#f9bc60] hover:bg-[#1f2937]/80 rounded-xl transition-all backdrop-blur-sm z-20"
            aria-label="Закрыть"
          >
            <LucideIcons.X size="sm" />
          </motion.button>

          {/* Заголовок - фиксированный */}
          <div className="text-center px-6 pt-6 pb-3 sm:px-8 sm:pt-8 sm:pb-4 relative z-10 flex-shrink-0">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#f9bc60] via-[#e8a545] to-[#d4a017] flex items-center justify-center shadow-xl shadow-[#f9bc60]/20 relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              <LucideIcons.User
                size="lg"
                className="text-[#001e1d] relative z-10"
              />
            </motion.div>
            <motion.h1
              id="auth-modal-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-transparent"
            >
              {isSignup ? "Регистрация" : "Вход в аккаунт"}
            </motion.h1>
            <motion.p
              id="auth-modal-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-[#6b7280] leading-relaxed"
            >
              {showEmailForm
                ? isSignup
                  ? "Зарегистрируйтесь по почте"
                  : "Войдите по почте"
                : isSignup
                  ? "Продолжите через Telegram, Google или зарегистрируйтесь по почте"
                  : "Продолжите через Telegram, Google или войдите по почте"}
            </motion.p>
          </div>

          {/* Основной контент - скроллируемый */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide px-6 sm:px-8 py-4 relative z-10 flex items-center justify-center min-h-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="w-full">
              {isSignup ? (
                <SignupView
                  showEmailForm={showEmailForm}
                  checkingAuth={checkingAuth}
                  onTelegramAuth={onTelegramAuth}
                  onGoogleAuth={onGoogleAuth}
                  onEmailSignup={onEmailSignup}
                  busy={busy}
                  error={error}
                />
              ) : (
                <LoginView
                  showEmailForm={showEmailForm}
                  checkingAuth={checkingAuth}
                  onTelegramAuth={onTelegramAuth}
                  onGoogleAuth={onGoogleAuth}
                  onEmailLogin={onEmailLogin}
                  busy={busy}
                  error={error}
                />
              )}
            </div>
          </div>

          {/* Переключатель Вход / Регистрация - фиксированный внизу */}
          <AuthModeSwitcher isSignup={isSignup} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
