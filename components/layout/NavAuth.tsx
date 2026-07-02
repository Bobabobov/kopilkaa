"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { clearAuthCache, useAuth } from "@/hooks/useAuth";

interface NavAuthProps {
  isMobile?: boolean;
  /** В drawer профиль вынесен в карточку сверху */
  hideProfileLink?: boolean;
  onLinkClick?: () => void;
}

export default function NavAuth({
  isMobile = false,
  hideProfileLink = false,
  onLinkClick,
}: NavAuthProps) {
  const { user, isAdminAllowed, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const loginHref = buildAuthModalUrl({
    pathname,
    search,
    modal: "auth",
  }) as Route;
  const signupHref = buildAuthModalUrl({
    pathname,
    search,
    modal: "auth/signup",
  }) as Route;

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearAuthCache();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
      router.refresh();
    }
  };

  const handleLogout = async () => {
    onLinkClick?.();
    await logout();
  };

  // Для гостя кнопки показываем сразу — не ждём ответ /api/profile/me
  if (!user) {
    if (isMobile) {
      return (
        <div className="flex w-full gap-2">
          <Link
            href={loginHref}
            onClick={onLinkClick}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full border px-4 py-2.5 text-center text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              backgroundColor: "rgba(249, 188, 96, 0.05)",
              borderColor: "rgba(249, 188, 96, 0.6)",
              color: "#f9bc60",
            }}
          >
            Вход
          </Link>
          <Link
            href={signupHref}
            onClick={onLinkClick}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold text-[#001e1d] transition-all duration-200 active:scale-[0.98]"
            style={{ backgroundColor: "#f9bc60" }}
          >
            Регистрация
          </Link>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href={loginHref}
          onClick={onLinkClick}
          className="whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{
            color: "#f9bc60",
            backgroundColor: "rgba(249, 188, 96, 0.05)",
            borderColor: "rgba(249, 188, 96, 0.45)",
          }}
        >
          Вход
        </Link>
        <Link
          href={signupHref}
          onClick={onLinkClick}
          className="whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d",
          }}
        >
          Регистрация
        </Link>
      </div>
    );
  }

  if (loading) {
    if (isMobile) {
      return (
        <div className="flex w-full gap-2">
          <div className="h-11 min-w-0 flex-1 animate-pulse rounded-full bg-white/10" />
          <div className="h-11 min-w-0 flex-1 animate-pulse rounded-full bg-white/10" />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-[72px] animate-pulse rounded-xl bg-white/5" />
        <div className="h-9 w-[108px] animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        isMobile
          ? hideProfileLink
            ? "w-full flex-row flex-wrap gap-2"
            : "w-full flex-col gap-2"
          : "items-center gap-2"
      }`}
    >
      {!hideProfileLink && (
        <Link
          href="/profile"
          onClick={onLinkClick}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isMobile ? "w-full text-center" : "whitespace-nowrap"
          }`}
          style={{
            color: "#fffffe",
            backgroundColor: "rgba(171, 209, 198, 0.1)",
            border: "1px solid rgba(171, 209, 198, 0.3)",
          }}
        >
          <span className="hidden sm:inline">Личный кабинет</span>
          <span className="sm:hidden">Профиль</span>
        </Link>
      )}
      {isAdminAllowed && (
        <Link
          href="/admin"
          onClick={onLinkClick}
          className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            isMobile
              ? hideProfileLink
                ? "min-w-0 flex-1 text-center"
                : "w-full text-center"
              : ""
          }`}
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d",
          }}
        >
          <span className="hidden sm:inline">Админка</span>
          <span className="sm:hidden">Админ</span>
        </Link>
      )}
      <button
        type="button"
        onClick={handleLogout}
        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-105 ${
          isMobile
            ? hideProfileLink
              ? "min-w-0 flex-1 text-center"
              : "w-full text-center"
            : ""
        }`}
        style={{
          color: "#fffffe",
          backgroundColor: "rgba(171, 209, 198, 0.1)",
          border: "1px solid rgba(171, 209, 198, 0.3)",
        }}
      >
        Выйти
      </button>
    </div>
  );
}
