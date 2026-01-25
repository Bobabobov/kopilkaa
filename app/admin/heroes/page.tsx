// app/admin/heroes/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminHeroesClient from "./AdminHeroesClient";

export const dynamic = "force-dynamic";

export default async function AdminHeroesPage() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect("/");
  return <AdminHeroesClient />;
}
