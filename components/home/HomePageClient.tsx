import dynamic from "next/dynamic";
import HeroSection from "./HeroSection";
import RecentApplications from "./RecentApplications";
import TopDonorsInline from "./TopDonorsInline";
import { HomeSectionSkeleton } from "./HomeSectionSkeleton";
import type { HomePageContentProps } from "./hero-section/types";

const HowItWorks = dynamic(() => import("./HowItWorks"), {
  loading: () => <HomeSectionSkeleton />,
});

const HomeReviewsSection = dynamic(() => import("./HomeReviewsSection"), {
  loading: () => <HomeSectionSkeleton />,
});

const HomeGoodDeedsSection = dynamic(() => import("./HomeGoodDeedsSection"), {
  loading: () => <HomeSectionSkeleton />,
});

const FAQ = dynamic(() => import("./FAQ"), {
  loading: () => <HomeSectionSkeleton className="h-80" />,
});

export default function HomePageClient({
  initialStats,
  recentApplications,
  topDonors,
}: HomePageContentProps) {
  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <HeroSection stats={initialStats} />
        <RecentApplications applications={recentApplications} />
        <HomeReviewsSection />
        <HowItWorks />
        <TopDonorsInline donors={topDonors} />
        <HomeGoodDeedsSection />
        <FAQ />
      </div>
    </div>
  );
}
