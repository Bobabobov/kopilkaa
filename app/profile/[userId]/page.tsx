// app/profile/[userId]/page.tsx
"use client";
import OtherUserProfile from "@/components/profile/OtherUserProfile";

interface ProfilePageProps {
  params: { userId: string };
}

export default function UserProfilePage({ params }: ProfilePageProps) {
  return <OtherUserProfile userId={params.userId} />;
}
