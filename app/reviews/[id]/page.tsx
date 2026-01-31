import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import ReviewDetailClient from "./_components/ReviewDetailClient";
import type { ReviewItem } from "@/hooks/reviews/useReviews";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchReview(id: string): Promise<ReviewItem | null> {
  try {
    const res = await fetch(`${baseUrl}/api/reviews/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.review as ReviewItem) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const review = await prisma.review.findUnique({
    where: { id },
    select: {
      content: true,
      user: { select: { name: true, username: true } },
    },
  });
  if (!review) {
    return { title: "Отзыв не найден" };
  }
  const authorName =
    review.user?.name ||
    (review.user?.username ? `@${review.user.username}` : "Участник");
  const title = `Отзыв от ${authorName}`;
  const description =
    review.content?.slice(0, 160).trim() || "Отзыв участника платформы Копилка";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    return (
      <ReviewDetailClient
        reviewId=""
        initialReview={null}
        initialError="Отзыв не найден"
      />
    );
  }

  const initialReview = await fetchReview(id);
  const initialError =
    initialReview === null ? "Отзыв не найден" : null;

  return (
    <ReviewDetailClient
      reviewId={id}
      initialReview={initialReview}
      initialError={initialError}
    />
  );
}
