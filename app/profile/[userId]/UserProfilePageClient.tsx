"use client";

import { useParams } from "next/navigation";
import OtherUserProfile from "@/components/profile/other-user/OtherUserProfile";

export default function UserProfilePageClient() {
  const params = useParams();
  const userId = params?.userId as string | undefined;

  if (!userId) {
    return null;
  }

  return <OtherUserProfile userId={userId} />;
}
