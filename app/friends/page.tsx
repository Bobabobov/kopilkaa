import { Suspense } from "react";
import FriendsPageClient from "./_components/FriendsPageClient";

export default function FriendsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-[#abd1c6]">
          Загружаем друзей...
        </div>
      }
    >
      <FriendsPageClient />
    </Suspense>
  );
}
