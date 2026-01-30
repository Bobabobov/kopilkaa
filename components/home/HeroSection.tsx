"use client";

import { HeroSectionHeadline } from "./hero-section/HeroSectionHeadline";
import { HeroSectionCta } from "./hero-section/HeroSectionCta";
import { HeroSectionAds } from "./hero-section/HeroSectionAds";
import { HeroSectionStats } from "./hero-section/HeroSectionStats";
import TelegramChannel from "./TelegramChannel";
import type { HeroSectionProps } from "./hero-section/types";

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  return (
    <section className="relative px-4 pt-12 pb-14 sm:pt-16 sm:pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-4xl mx-auto">
          <HeroSectionHeadline />
          <HeroSectionCta />
          <HeroSectionAds />
          <div className="mb-12">
            <TelegramChannel />
          </div>
          <HeroSectionStats stats={stats} loading={loading} />
        </div>
      </div>
    </section>
  );
}
