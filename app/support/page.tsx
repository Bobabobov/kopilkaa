"use client";

import { useState } from "react";
import PixelBackground from "@/components/ui/PixelBackground";
import SupportHero from "@/components/support/SupportHero";
import SupportToggle from "@/components/support/SupportToggle";
import SubscriptionPlans from "@/components/support/SubscriptionPlans";
import OneTimeSupport from "@/components/support/OneTimeSupport";
import SupportBenefits from "@/components/support/SupportBenefits";

export default function SupportPage() {
  const [subscriptionAmount, setSubscriptionAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isSubscription, setIsSubscription] = useState(true);

  return (
    <div className="min-h-screen">
      <PixelBackground />
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
          />
        ) : (
          <OneTimeSupport 
            customAmount={customAmount}
            onAmountChange={setCustomAmount}
          />
        )}

        <SupportBenefits />
      </div>
    </div>
  );
}
