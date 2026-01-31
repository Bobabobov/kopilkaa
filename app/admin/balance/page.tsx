// app/admin/balance/page.tsx
import { redirect } from "next/navigation";
import { getAllowedAdminUser } from "@/lib/adminAccess";
import AdminBalanceClient from "./AdminBalanceClient";

export const dynamic = "force-dynamic";

export default async function Page() {
  const admin = await getAllowedAdminUser();
  if (!admin) redirect("/");
  return <AdminBalanceClient />;
}
