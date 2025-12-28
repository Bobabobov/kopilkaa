// app/admin/users/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminUsersClient from "./AdminUsersClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) {
    redirect("/");
  }
  return <AdminUsersClient />;
}




