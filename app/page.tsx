import StatsLoader from "@/components/home/StatsLoader";
import HomePageClient from "@/components/home/HomePageClient";
import { getRecentApplications } from "@/lib/applications/getRecentApplications";
import { getTopDonors } from "@/lib/donations/getTopDonors";
import { FAQ_ITEMS } from "@/lib/content/faq";

export const dynamic = "force-dynamic";

// Fallback статистика для случая ошибки
const fallbackStats = {
  collected: 0,
  requests: 0,
  approved: 0,
  people: 0,
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer.replace(/\n\n/g, " "),
    },
  })),
};

export default async function HomePage() {
  const [stats, recentApplications, topDonors] = await Promise.all([
    StatsLoader().catch(() => fallbackStats),
    getRecentApplications(3),
    getTopDonors(3),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <HomePageClient
        initialStats={stats}
        recentApplications={recentApplications}
        topDonors={topDonors}
      />
    </>
  );
}
