// app/admin/reports/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminReportsClient from "./AdminReportsClient";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }
  return <AdminReportsClient />;
}

