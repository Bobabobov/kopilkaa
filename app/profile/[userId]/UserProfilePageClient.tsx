"use client";

import { useParams } from "next/navigation";
import OtherUserProfile from "@/components/profile/other-user/OtherUserProfile";

export default function UserProfilePageClient() {
  const params = useParams();
  const userId = params?.userId as string | undefined;

  if (!userId?.trim()) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        role="main"
        aria-label="Профиль"
      >
        <p className="text-center text-[#abd1c6] text-lg" role="alert">
          Ссылка на профиль указана неверно.
        </p>
      </div>
    );
  }

  return <OtherUserProfile userId={userId} />;
}
