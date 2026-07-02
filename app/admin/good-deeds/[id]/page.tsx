import { GoodDeedDetailClient } from "./_components/GoodDeedDetailClient";

export const dynamic = "force-dynamic";

export default function AdminGoodDeedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <GoodDeedDetailClient submissionId={params.id} />;
}
