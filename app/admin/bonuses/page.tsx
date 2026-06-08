import { Suspense } from "react";
import AdminBonusesClient from "./AdminBonusesClient";

export const dynamic = "force-dynamic";

export default function AdminBonusesPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-[#abd1c6]">
          Загрузка...
        </div>
      }
    >
      <AdminBonusesClient />
    </Suspense>
  );
}
