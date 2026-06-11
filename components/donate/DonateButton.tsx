"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcons } from "@/components/ui/LucideIcons";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { PreSupportModal } from "@/components/donate/PreSupportModal";

interface DonateButtonProps {
  className?: string;
  variant?: "default" | "large";
}

const DALINK_URL = "https://dalink.to/kopilkaonline";

export default function DonateButton({
  className = "",
  variant = "default",
}: DonateButtonProps) {
  const [isPreSupportOpen, setIsPreSupportOpen] = useState(false);
  const [profile, setProfile] = useState<{
    username: string | null;
    isAuthed: boolean;
  } | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const suggestedTag = useMemo(
    () => (profile?.username ? `@${profile.username}` : "@username"),
    [profile?.username],
  );

  async function ensureProfileLoaded() {
    if (profile !== null || isLoadingProfile) return;
    try {
      setIsLoadingProfile(true);
      const res = await fetch("/api/profile/me", { cache: "no-store" });
      if (!res.ok) {
        setProfile({ username: null, isAuthed: false });
        return;
      }
      const data = await res.json().catch(() => null);
      const username =
        (data?.user?.username as string | null | undefined) ?? null;
      setProfile({ username, isAuthed: true });
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  function closePreSupport() {
    setIsPreSupportOpen(false);
  }

  const authSignupUrl = buildAuthModalUrl({
    pathname: typeof window !== "undefined" ? window.location.pathname : "/",
    search: typeof window !== "undefined" ? window.location.search : "",
    modal: "auth/signup",
  });

  const preSupportModal = (
    <PreSupportModal
      isOpen={isPreSupportOpen}
      profile={profile}
      suggestedTag={suggestedTag}
      authSignupUrl={authSignupUrl}
      dalinkUrl={DALINK_URL}
      onClose={closePreSupport}
      onCopyLogin={() => copyText(suggestedTag)}
    />
  );

  if (variant === "large") {
    return (
      <div className={className}>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsPreSupportOpen(true);
            ensureProfileLoaded();
          }}
          className="px-12 py-4 text-xl font-bold rounded-2xl transition-all duration-300 hover:shadow-lg shadow-lg"
          style={{
            backgroundColor: "#f9bc60",
            color: "#001e1d",
          }}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <LucideIcons.Heart size="md" />
            <span>Пополнить копилку</span>
          </span>
        </motion.button>
        {preSupportModal}
      </div>
    );
  }

  return (
    <div className={className}>
      <button
        onClick={() => {
          setIsPreSupportOpen(true);
          ensureProfileLoaded();
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
        style={{
          backgroundColor: "#f9bc60",
          color: "#001e1d",
        }}
      >
        <LucideIcons.Heart size="sm" />
        <span>Пополнить копилку</span>
      </button>
      {preSupportModal}
    </div>
  );
}
