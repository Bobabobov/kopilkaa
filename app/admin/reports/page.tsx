// app/admin/reports/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminReportsClient from "./AdminReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/");
  }
  return <AdminReportsClient />;
}

