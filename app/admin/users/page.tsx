// app/admin/users/page.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminUsersClient from "./AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }
  return <AdminUsersClient />;
}




