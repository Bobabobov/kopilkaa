"use client";

import dynamic from "next/dynamic";
import UniversalBackground from "@/components/ui/UniversalBackground";
import HeroSection from "./HeroSection";
import TopDonorsInline from "./TopDonorsInline";

// Lazy load heavy components только там, где это оправдано
const HowItWorks = dynamic(() => import("./HowItWorks"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const RecentApplications = dynamic(() => import("./RecentApplications"), {
  ssr: false,
  loading: () => <div className="h-64 bg-[#004643]/30 animate-pulse rounded-3xl" />
});

const FAQ = dynamic(() => import("./FAQ"), {
  ssr: false,
  loading: () => <div className="h-96 bg-[#004643]/30 animate-pulse rounded-3xl" />
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
      <UniversalBackground />
      <div className="relative z-10">
        <HeroSection stats={initialStats} loading={false} />
        <TopDonorsInline />
        <HowItWorks />
        <RecentApplications />
        <FAQ />
      </div>
    </div>
  );
}

