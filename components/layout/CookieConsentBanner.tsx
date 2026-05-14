"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  hasCookieConsent,
  setCookieConsentAccepted,
} from "@/lib/cookieConsent";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!hasCookieConsent());
  }, []);

  const handleAccept = () => {
    setCookieConsentAccepted();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[120] sm:inset-x-auto sm:left-6 sm:bottom-6">
      <div className="w-full max-w-[520px] rounded-2xl border border-[#abd1c6]/20 bg-[#111315]/95 p-4 text-[#fffffe] shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur md:max-w-[420px] md:p-4">
        <p className="text-[1.05rem] font-semibold leading-snug md:text-[1.35rem] md:font-bold md:leading-tight">
          Мы используем файлы cookie, потому что так работает интернет
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[#e6e6e6] md:text-[1.05rem] md:leading-snug">
          Без них интернет работал бы плохо;(
        </p>

        <div className="mt-4 flex flex-wrap gap-2 md:mt-4">
          <Button
            type="button"
            onClick={handleAccept}
            className="h-10 rounded-xl bg-[#1ca66a] px-5 text-sm font-semibold text-white hover:bg-[#16925c] md:h-9 md:px-4 md:text-[0.95rem]"
          >
            Хорошо, понятно
          </Button>
          <Button
            asChild
            type="button"
            variant="secondary"
            className="h-10 rounded-xl border border-white/10 bg-[#2a2d31] px-5 text-sm font-semibold text-[#ececec] hover:bg-[#33373c] md:h-9 md:px-4 md:text-[0.95rem]"
          >
            <Link href="/cookies">А что это такое?</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
