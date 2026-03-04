"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

interface AuthModeSwitcherProps {
  isSignup: boolean;
}

export function AuthModeSwitcher({ isSignup }: AuthModeSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const loginHref = buildAuthModalUrl({ pathname, search, modal: "auth" });
  const signupHref = buildAuthModalUrl({
    pathname,
    search,
    modal: "auth/signup",
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="px-6 py-4 sm:px-8 border-t border-white/[0.08] text-center relative z-10 flex-shrink-0"
    >
      {isSignup ? (
        <p className="text-sm text-[#abd1c6]">
          Уже есть аккаунт?{" "}
          <Link
            href={loginHref}
            className="font-semibold text-[#f9bc60] hover:underline transition-all"
          >
            Войти
          </Link>
        </p>
      ) : (
        <p className="text-sm text-[#abd1c6]">
          Нет аккаунта?{" "}
          <Link
            href={signupHref}
            className="font-semibold text-[#f9bc60] hover:underline transition-all"
          >
            Регистрация
          </Link>
        </p>
      )}
    </motion.div>
  );
}
