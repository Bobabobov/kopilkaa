import type { Metadata } from "next";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import ReviewDetailClient from "./_components/ReviewDetailClient";
import type { ReviewItem } from "@/hooks/reviews/useReviews";
import { getInternalApiBaseUrl } from "@/lib/siteOrigin";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";
import { logRouteCatchError } from "@/lib/api/parseApiError";

const baseUrl = getInternalApiBaseUrl();

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchReview(
  id: string,
  cookieHeader: string,
): Promise<ReviewItem | null> {
  if (!isValidCuidLikeId(id)) return null;
  try {
    const res = await fetch(`${baseUrl}/api/reviews/${id}`, {
      cache: "no-store",
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { review?: ReviewItem };
    return json.review ?? null;
  } catch (error) {
    logRouteCatchError(`[ReviewDetailPage] fetchReview(${id})`, error);
    return null;
  }
}

type ReviewMetaOk = {
  kind: "ok";
  title: string;
  description: string;
  publishedTime?: string;
  firstImageUrl: string | null;
};

type ReviewMetaResult =
  | ReviewMetaOk
  | { kind: "invalid" }
  | { kind: "notFound" }
  | { kind: "error" };

async function fetchReviewMetadata(id: string): Promise<ReviewMetaResult> {
  if (!isValidCuidLikeId(id)) {
    return { kind: "invalid" };
  }

  try {
    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        content: true,
        createdAt: true,
        user: { select: { name: true, username: true } },
        images: {
          orderBy: { sort: "asc" },
          take: 1,
          select: { url: true },
        },
      },
    });

    if (!review) {
      return { kind: "notFound" };
    }

    const authorName =
      review.user?.name ||
      (review.user?.username ? `@${review.user.username}` : "Участник");
    const title = `Отзыв от ${authorName}`;
    const description =
      review.content?.slice(0, 160).trim() ||
      "Отзыв участника платформы Копилка";

    const createdMs = new Date(review.createdAt).getTime();
    const publishedTime = Number.isNaN(createdMs)
      ? undefined
      : new Date(createdMs).toISOString();

    const firstImageUrl = review.images[0]?.url ?? null;

    return {
      kind: "ok",
      title,
      description,
      publishedTime,
      firstImageUrl,
    };
  } catch (error) {
    logRouteCatchError(`[ReviewDetailPage] fetchReviewMetadata(${id})`, error);
    return { kind: "error" };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const path = `/reviews/${id}`;
  const meta = await fetchReviewMetadata(id);

  if (meta.kind === "invalid") {
    return {
      title: "Отзыв",
      robots: { index: false, follow: true },
    };
  }

  if (meta.kind === "notFound") {
    return {
      title: "Отзыв не найден",
      description: "Такого отзыва нет на платформе Копилка.",
      robots: { index: false, follow: true },
    };
  }

  if (meta.kind === "error") {
    return {
      title: "Отзыв",
      robots: { index: false, follow: true },
    };
  }

  const ogImages = meta.firstImageUrl
    ? [{ url: meta.firstImageUrl, alt: meta.title.slice(0, 200) }]
    : undefined;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: "Копилка",
      locale: "ru_RU",
      publishedTime: meta.publishedTime,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: ogImages?.map((img) => img.url),
    },
  };
}

export default async function ReviewDetailPage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  if (!id || !isValidCuidLikeId(id)) {
    return (
      <ReviewDetailClient initialReview={null} initialError="Отзыв не найден" />
    );
  }

  const initialReview = await fetchReview(id, cookieHeader);
  const initialError = initialReview === null ? "Отзыв не найден" : null;

  return (
    <ReviewDetailClient
      initialReview={initialReview}
      initialError={initialError}
    />
  );
}
