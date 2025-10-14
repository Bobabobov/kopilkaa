"use client";

import {
  AdvertisingHero,
  AdvertisingFormats,
  AdvertisingBenefits,
  AdvertisingSteps,
  AdvertisingContact,
} from "@/components/advertising";

export default function AdvertisingPage() {
  return (
    <div className="min-h-screen pb-20">
      <AdvertisingHero />
      <AdvertisingFormats />
      <AdvertisingBenefits />
      <AdvertisingSteps />
      <AdvertisingContact />
    </div>
  );
}