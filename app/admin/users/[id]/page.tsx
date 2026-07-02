import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminUserDetailClient from "./AdminUserDetailClient";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/");
  }

  const { id } = await params;
  return <AdminUserDetailClient userId={id} />;
}
