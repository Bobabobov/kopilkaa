"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GlassModal } from "@/components/ui/GlassModal";
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
  signupPendingEmail?: string | null;
  signupMailDispatchFailed?: boolean;
  signupDevLink?: string | null;
  onResendSignupVerification?: () => void | Promise<void>;
  resendSignupBusy?: boolean;
  resendSignupMessage?: string | null;
  loginPendingVerificationEmail?: string | null;
  onResendLoginVerification?: () => void | Promise<void>;
  resendLoginBusy?: boolean;
  resendLoginMessage?: string | null;
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
  signupPendingEmail,
  signupMailDispatchFailed,
  signupDevLink,
  onResendSignupVerification,
  resendSignupBusy,
  resendSignupMessage,
  loginPendingVerificationEmail,
  onResendLoginVerification,
  resendLoginBusy,
  resendLoginMessage,
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

    const focusables = getFocusable();
    const initial = focusables[0] || dialog;
    if (initial) {
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
      try {
        lastActiveElementRef.current?.focus?.();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <GlassModal
      open
      onClose={closeModal}
      hideHeader
      showCloseButton={false}
      size="lg"
      panelClassName="max-w-[520px]"
      zIndex={100}
      dialogRef={dialogRef}
      bodyClassName="p-0 flex flex-col min-h-0"
      ariaLabelledBy="auth-modal-title"
      ariaDescribedBy="auth-modal-desc"
      header={
        <div className="relative shrink-0 border-b border-white/[0.08] px-6 pt-6 pb-3 sm:px-8 sm:pt-8 sm:pb-4">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={closeModal}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl text-[#abd1c6] transition-all hover:bg-white/10 hover:text-[#f9bc60]"
            aria-label="Закрыть"
          >
            <LucideIcons.X size="sm" />
          </motion.button>

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f9bc60] via-[#e8a545] to-[#d4a017] shadow-xl shadow-[#f9bc60]/20"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
              <LucideIcons.User
                size="lg"
                className="relative z-10 text-[#001e1d]"
              />
            </motion.div>
            <motion.h1
              id="auth-modal-title"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 bg-gradient-to-r from-[#fffffe] to-[#abd1c6] bg-clip-text text-2xl font-bold text-transparent sm:text-3xl"
            >
              {isSignup ? "Регистрация" : "Вход в аккаунт"}
            </motion.h1>
            <motion.p
              id="auth-modal-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-sm leading-relaxed text-[#abd1c6]"
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
        </div>
      }
      footer={<AuthModeSwitcher isSignup={isSignup} />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-x-hidden px-6 py-4 sm:px-8">
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
              signupPendingEmail={signupPendingEmail}
              signupMailDispatchFailed={signupMailDispatchFailed}
              signupDevLink={signupDevLink}
              onResendSignupVerification={onResendSignupVerification}
              resendSignupBusy={resendSignupBusy}
              resendSignupMessage={resendSignupMessage}
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
              loginPendingVerificationEmail={loginPendingVerificationEmail}
              onResendLoginVerification={onResendLoginVerification}
              resendLoginBusy={resendLoginBusy}
              resendLoginMessage={resendLoginMessage}
            />
          )}
        </div>
      </div>
    </GlassModal>
  );
}
