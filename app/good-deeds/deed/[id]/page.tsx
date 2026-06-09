import { GoodDeedDeedClient } from "./_components/GoodDeedDeedClient";
import { notFound } from "next/navigation";
import { isValidCuidLikeId } from "@/lib/reviews/reviewId";

export default async function GoodDeedDeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidCuidLikeId(id)) {
    notFound();
  }
  return <GoodDeedDeedClient id={id} />;
}
