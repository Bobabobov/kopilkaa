"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthModal } from "./AuthModal";

type AuthMode = "login" | "signup";

export default function AuthModalRoot() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modal = searchParams.get("modal");
  const nextParam = searchParams.get("next");

  const isAuthModal =
    modal === "auth" ||
    modal === "auth/signup" ||
    modal === "auth/login/email" ||
    modal === "auth/signup/email";

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getSafeNext(nextValue: string | null): string | null {
    if (!nextValue) return null;
    let decoded = nextValue;
    try {
      decoded = decodeURIComponent(nextValue);
    } catch {
      // keep raw
    }
    const v = String(decoded).trim();
    // Allow only internal navigation to prevent open-redirect issues
    if (!v.startsWith("/")) return null;
    if (v.startsWith("//")) return null;
    if (v.includes("://")) return null;
    if (v.includes("\n") || v.includes("\r")) return null;
    return v;
  }

  const safeNext = getSafeNext(nextParam);

  async function safeReadJson(res: Response): Promise<any> {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  function getRetryAfterSeconds(res: Response, fallbackSec: number): number {
    const raw = res.headers.get("Retry-After");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : fallbackSec;
  }

  // Блокируем скролл когда модалка открыта
  useEffect(() => {
    if (isAuthModal) {
      const scrollY = window.scrollY;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.documentElement.style.overflow = "hidden";

      const preventScroll = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      document.addEventListener("wheel", preventScroll, { passive: false });
      document.addEventListener("touchmove", preventScroll, { passive: false });
      document.addEventListener("scroll", preventScroll, { passive: false });

      return () => {
        document.removeEventListener("wheel", preventScroll);
        document.removeEventListener("touchmove", preventScroll);
        document.removeEventListener("scroll", preventScroll);

        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.documentElement.style.overflow = "";

        window.scrollTo(0, scrollY);
      };
    }
  }, [isAuthModal]);

  // Проверяем авторизацию
  useEffect(() => {
    if (!isAuthModal) return;

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            router.replace(safeNext || "/profile");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [isAuthModal, router]);

  if (!isAuthModal || checkingAuth) return null;

  const mode: AuthMode =
    modal === "auth/signup" || modal === "auth/signup/email"
      ? "signup"
      : "login";

  const handleTelegramAuth = async (user: any) => {
    try {
      setError(null);
      setBusy(true);

      const r = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegram: user }),
      });
      const data = await r.json();

      if (!r.ok || !data?.success) {
        console.error("Ошибка ответа /api/auth/telegram:", data);
        setError(data?.error || "Ошибка входа через Telegram");
        return;
      }

      window.location.href = safeNext || "/profile";
    } catch (error: any) {
      console.error("Telegram login error:", error);
      setError(error?.message || "Ошибка входа через Telegram");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogleAuth = async (data: any) => {
    try {
      setError(null);
      setBusy(true);

      const r = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google: data }),
      });
      const responseData = await r.json();

      if (!r.ok || !responseData?.success) {
        console.error("Ошибка ответа /api/auth/google:", responseData);
        setError(responseData?.error || "Ошибка входа через Google");
        return;
      }

      window.location.href = safeNext || "/profile";
    } catch (error: any) {
      console.error("Google login error:", error);
      setError(error?.message || "Ошибка входа через Google");
    } finally {
      setBusy(false);
    }
  };

  const handleEmailLogin = async (identifier: string, password: string) => {
    try {
      setError(null);
      setBusy(true);

      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      if (r.status === 429) {
        const waitSec = getRetryAfterSeconds(r, 60);
        setError(
          `Слишком много попыток. Подождите ${waitSec} сек и попробуйте снова.`,
        );
        return;
      }

      const data = await safeReadJson(r);

      if (!r.ok) {
        setError(data?.message || data?.error || "Ошибка входа");
        return;
      }

      if (data.ok) {
        window.location.href = safeNext || "/profile";
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSignup = async (
    email: string,
    name: string,
    password: string,
  ) => {
    try {
      setError(null);
      setBusy(true);

      // Генерируем username из name или email
      const nameForUsername = name
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}._-]/gu, "")
        .substring(0, 20);
      const emailForUsername = email
        .trim()
        .toLowerCase()
        .split("@")[0]
        .replace(/[^\p{L}\p{N}._-]/gu, "")
        .substring(0, 20);
      const generatedUsername =
        nameForUsername || emailForUsername || `user${Date.now()}`;

      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          username: generatedUsername,
          password,
          name: name.trim() || null,
        }),
      });
      if (r.status === 429) {
        const waitSec = getRetryAfterSeconds(r, 60);
        setError(
          `Слишком много попыток. Подождите ${waitSec} сек и попробуйте снова.`,
        );
        return;
      }

      const data = await safeReadJson(r);

      if (!r.ok) {
        // 409 = почта/логин уже заняты. Показываем точное сообщение с бэка.
        setError(data?.message || data?.error || "Ошибка регистрации");
        return;
      }

      if (data.ok) {
        window.location.href = safeNext || "/profile";
      }
    } catch (error: any) {
      console.error("Register error:", error);
      setError(error.message || "Ошибка регистрации");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthModal
      mode={mode}
      checkingAuth={checkingAuth}
      onTelegramAuth={handleTelegramAuth}
      onGoogleAuth={handleGoogleAuth}
      onEmailLogin={handleEmailLogin}
      onEmailSignup={handleEmailSignup}
      busy={busy}
      error={error}
    />
  );
}
