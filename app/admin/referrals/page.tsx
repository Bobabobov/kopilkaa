import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminReferralsClient from "./AdminReferralsClient";

export const dynamic = "force-dynamic";

export default async function AdminReferralsPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect("/");
  return <AdminReferralsClient />;
}
