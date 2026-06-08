import { redirect } from "next/navigation";

export default function AdminGoodDeedWithdrawalsRedirectPage() {
  redirect("/admin/bonuses?tab=withdrawals");
}
