"use client";

import { HeroSectionHeadline } from "./hero-section/HeroSectionHeadline";
import { HeroSectionForWho } from "./hero-section/HeroSectionForWho";
import { HeroSectionCta } from "./hero-section/HeroSectionCta";
import { HeroSectionAds } from "./hero-section/HeroSectionAds";
import { HeroSectionStats } from "./hero-section/HeroSectionStats";
import type { HeroSectionProps } from "./hero-section/types";

export default function HeroSection({ stats, loading }: HeroSectionProps) {
  return (
    <section className="relative px-4 pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center max-w-4xl mx-auto">
          <HeroSectionHeadline />
          <div className="mb-10">
            <HeroSectionStats stats={stats} loading={loading} />
          </div>
          <HeroSectionForWho />
          <HeroSectionCta />
          <HeroSectionAds />
        </div>
      </div>
    </section>
  );
}
