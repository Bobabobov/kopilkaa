import { Suspense } from "react";
import AdminGoodDeedsClient from "./AdminGoodDeedsClient";

export const dynamic = "force-dynamic";

export default function AdminGoodDeedsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-24 text-[#abd1c6]">
          Загрузка...
        </div>
      }
    >
      <AdminGoodDeedsClient />
    </Suspense>
  );
}
