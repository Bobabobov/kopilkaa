"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface AuthModeSwitcherProps {
  isSignup: boolean;
}

export function AuthModeSwitcher({ isSignup }: AuthModeSwitcherProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="px-6 py-4 sm:px-8 border-t border-[#1f2937]/50 text-center relative z-10 flex-shrink-0"
    >
      {isSignup ? (
        <p className="text-sm" style={{ color: "#6b7280" }}>
          Уже есть аккаунт?{" "}
          <Link
            href="/?modal=auth"
            className="font-semibold hover:underline transition-all hover:text-[#f9bc60] relative group"
            style={{ color: "#f9bc60" }}
          >
            Войти
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f9bc60] group-hover:w-full transition-all duration-300" />
          </Link>
        </p>
      ) : (
        <p className="text-sm" style={{ color: "#6b7280" }}>
          Нет аккаунта?{" "}
          <Link
            href="/?modal=auth/signup"
            className="font-semibold hover:underline transition-all hover:text-[#f9bc60] relative group"
            style={{ color: "#f9bc60" }}
          >
            Регистрация
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f9bc60] group-hover:w-full transition-all duration-300" />
          </Link>
        </p>
      )}
    </motion.div>
  );
}

