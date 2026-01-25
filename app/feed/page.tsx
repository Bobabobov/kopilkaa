"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FeedContent from "./FeedContent";

export default function FeedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative overflow-hidden">
          <div className="container-p mx-auto pt-12 pb-12 relative z-10 text-center text-[#abd1c6]">
            Загрузка...
          </div>
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}
