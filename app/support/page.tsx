"use client";

import { useEffect, useState } from "react";
import SupportHero from "@/components/support/SupportHero";
import SupportToggle from "@/components/support/SupportToggle";
import SubscriptionPlans from "@/components/support/SubscriptionPlans";
import OneTimeSupport from "@/components/support/OneTimeSupport";
import SupportBenefits from "@/components/support/SupportBenefits";
import SupportFAQ from "@/components/support/SupportFAQ";

export default function SupportPage() {
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubscription, setIsSubscription] = useState(true);
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

        <SupportToggle
          isSubscription={isSubscription}
          onToggle={setIsSubscription}
        />

        {isSubscription ? (
          <SubscriptionPlans
            customAmount={subscriptionAmount}
            onAmountChange={setSubscriptionAmount}
            showSocialPrompt={showSocialPrompt}
          />
        ) : (
          <OneTimeSupport
            customAmount={customAmount}
            onAmountChange={setCustomAmount}
            showSocialPrompt={showSocialPrompt}
          />
        )}

        <SupportBenefits />
        
        <SupportFAQ />
      </div>
    </div>
  );
}
