import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminReferralsReferrerClient from "./AdminReferralsReferrerClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ userId: string }> };

export default async function AdminReferralsReferrerPage({ params }: Props) {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect("/");
  const { userId } = await params;
  return <AdminReferralsReferrerClient userId={userId} />;
}
