"use client";

import dynamic from "next/dynamic";
import TopDonorsInline from "./TopDonorsInline";

/** Отдельный чанк: hero тянет подкомпоненты и анимации — не смешиваем с остальным бандлом главной. */
const HeroSection = dynamic(() => import("./HeroSection"), {
  loading: () => (
    <section className="relative px-4 pt-12 pb-8 sm:pt-16 sm:pb-10">
      <div className="mx-auto max-w-6xl animate-pulse space-y-6">
        <div className="h-5 bg-[#004643]/50 rounded w-48 mx-auto" />
        <div className="h-14 sm:h-16 bg-[#004643]/40 rounded-2xl max-w-4xl mx-auto" />
        <div className="h-24 bg-[#004643]/35 rounded-3xl max-w-2xl mx-auto" />
        <div className="flex justify-center gap-3">
          <div className="h-12 w-36 bg-[#004643]/40 rounded-xl" />
          <div className="h-12 w-36 bg-[#004643]/40 rounded-xl" />
        </div>
      </div>
    </section>
  ),
});

const HowItWorks = dynamic(() => import("./HowItWorks"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
  ),
});

const RecentApplications = dynamic(() => import("./RecentApplications"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-[#004643]/30 animate-pulse rounded-3xl" />
  ),
});

const HomeReviewsSection = dynamic(() => import("./HomeReviewsSection"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
  ),
});

const HomeGoodDeedsSection = dynamic(() => import("./HomeGoodDeedsSection"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
  ),
});

const FAQ = dynamic(() => import("./FAQ"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
  ),
});

type Stats = {
  collected: number;
  requests: number;
  approved: number;
  people: number;
};

interface HomePageClientProps {
  initialStats: Stats;
}

export default function HomePageClient({ initialStats }: HomePageClientProps) {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <HeroSection stats={initialStats} loading={false} />
        <RecentApplications />
        <HomeReviewsSection />
        <HowItWorks />
        <TopDonorsInline />
        <HomeGoodDeedsSection />
        <FAQ />
      </div>
    </div>
  );
}
