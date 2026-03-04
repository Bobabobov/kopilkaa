"use client";

import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import TopDonorsInline from "./TopDonorsInline";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

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
        <AnimatedSection yOffset={40} delay={0.1}>
          <RecentApplications />
        </AnimatedSection>
        <AnimatedSection yOffset={40} delay={0.05}>
          <HowItWorks />
        </AnimatedSection>
        <AnimatedSection yOffset={40} delay={0.05}>
          <TopDonorsInline />
        </AnimatedSection>
        <AnimatedSection yOffset={40} delay={0.05}>
          <FAQ />
        </AnimatedSection>
      </div>
    </div>
  );
}
