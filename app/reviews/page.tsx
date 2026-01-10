import { ReviewsSection } from "@/components/reviews/ReviewsSection";

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  return (
    <main className="min-h-screen w-full">
      <ReviewsSection />
    </main>
  );
}
