"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import SupportHero from "@/components/support/SupportHero";
import OneTimeSupport from "@/components/support/OneTimeSupport";
import SupportBenefits from "@/components/support/SupportBenefits";
import WhatYouGet from "@/components/support/WhatYouGet";
import { logRouteCatchError } from "@/lib/api/parseApiError";

export default function SupportPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [hasSocialLinks, setHasSocialLinks] = useState<boolean | null>(null);

  // Проверочка соц. сетей
  useEffect(() => {
    let isCancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile/me", { cache: "no-store" });
        if (!response.ok) {
          if (!isCancelled) {
            setHasSocialLinks(null);
          }
          return;
        }

        const data = await response.json();
        const user = data?.user;
        const hasLinks = Boolean(
          user?.vkLink || user?.telegramLink || user?.youtubeLink,
        );

        if (!isCancelled) {
          setHasSocialLinks(hasLinks);
        }
      } catch (error) {
        logRouteCatchError("[SupportPage] loadProfile", error);
        if (!isCancelled) {
          setHasSocialLinks(null);
        }
      }
    }

    loadProfile();

    return () => {
      isCancelled = true;
    };
  }, []);

  const showSocialPrompt = hasSocialLinks === false;

  return (
    <main
      className="min-h-screen relative"
      aria-label="Поддержка проекта Копилка"
    >
      {/* Фоновые блики */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#f9bc60]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#abd1c6]/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10">
        <SupportHero />

        <OneTimeSupport
          customAmount={customAmount}
          onAmountChange={setCustomAmount}
          showSocialPrompt={showSocialPrompt}
        />

        <SupportBenefits />
        <WhatYouGet />

        {/* Юр.ИНФО */}
        <section
          className="py-6 sm:py-8 px-3 sm:px-4"
          aria-labelledby="support-legal-heading"
        >
          <div className="max-w-4xl mx-auto">
            <Card variant="darkGlass" padding="md">
              <h2 id="support-legal-heading" className="sr-only">
                Юридическая информация о поддержке проекта
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#abd1c6]/90">
                Поддержка проекта является добровольной. Она не является
                инвестицией, пожертвованием конкретным лицам, оплатой услуг,
                рекламой или финансовым продуктом. Платформа «Копилка»
                самостоятельно принимает решения о распределении средств.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
