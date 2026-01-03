"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { TelegramWidget } from "./TelegramWidget";
import { GoogleButton } from "./GoogleButton";
import { EmailSignupForm } from "./EmailSignupForm";
import { usePathname, useSearchParams } from "next/navigation";
import { buildAuthModalUrl } from "@/lib/authModalUrl";

interface SignupViewProps {
  showEmailForm: boolean;
  checkingAuth: boolean;
  onTelegramAuth: (user: any) => Promise<void>;
  onGoogleAuth: (data: any) => Promise<void>;
  onEmailSignup: (email: string, name: string, password: string) => Promise<void>;
  busy: boolean;
  error: string | null;
}

export function SignupView({
  showEmailForm,
  checkingAuth,
  onTelegramAuth,
  onGoogleAuth,
  onEmailSignup,
  busy,
  error,
}: SignupViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString() ? `?${searchParams.toString()}` : "";
  const emailHref = buildAuthModalUrl({ pathname, search, modal: "auth/signup/email" });

  return (
    <>
      {!showEmailForm && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-xs mb-4 text-center text-[#6b7280] uppercase tracking-wider font-semibold">
              Через Telegram
            </p>
            <TelegramWidget onAuth={onTelegramAuth} checkingAuth={checkingAuth} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mb-6"
          >
            <p className="text-xs mb-4 text-center text-[#6b7280] uppercase tracking-wider font-semibold">
              Через Google
            </p>
            <GoogleButton onAuth={onGoogleAuth} checkingAuth={checkingAuth} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={emailHref}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#1f2937] to-[#374151] hover:from-[#374151] hover:to-[#4b5563] text-[#abd1c6] flex items-center justify-center gap-2.5 transition-all shadow-lg border border-[#1f2937]/50 relative z-10 block"
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#f9bc60]/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <LucideIcons.Mail size="sm" className="relative z-10" />
              <span className="relative z-10">Зарегистрироваться по почте</span>
            </Link>
          </motion.div>
        </>
      )}

      {showEmailForm && (
        <EmailSignupForm onSubmit={onEmailSignup} busy={busy} error={error} />
      )}
    </>
  );
}


