"use client";

import { useEffect, useState } from "react";
import SupportHero from "@/components/support/SupportHero";
import OneTimeSupport from "@/components/support/OneTimeSupport";
import SupportBenefits from "@/components/support/SupportBenefits";
import WhatYouGet from "@/components/support/WhatYouGet";
import HeroBadgesShowcase from "@/components/support/HeroBadgesShowcase";
import DonateGoal from "@/app/support/_components/DonateGoal";

export default function SupportPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [hasSocialLinks, setHasSocialLinks] = useState<boolean | null>(null);

  // Проверяем, есть ли у пользователя привязанные соцсети
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
      } catch {
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
    <div className="min-h-screen">
      <div className="relative z-10">
        <SupportHero />

        <OneTimeSupport
          customAmount={customAmount}
          onAmountChange={setCustomAmount}
          showSocialPrompt={showSocialPrompt}
          goalSlot={<DonateGoal />}
        />

        <HeroBadgesShowcase />
        <SupportBenefits />
        <WhatYouGet />

        {/* Юридическая информация */}
        <section className="py-6 sm:py-8 px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#004643]/18 backdrop-blur-sm border border-[#abd1c6]/15 rounded-2xl sm:rounded-3xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm leading-relaxed text-[#abd1c6]/90">
                Поддержка проекта является добровольной. Она не является инвестицией, пожертвованием конкретным лицам,
                оплатой услуг, рекламой или финансовым продуктом. Платформа «Копилка» самостоятельно принимает решения
                о распределении средств.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
