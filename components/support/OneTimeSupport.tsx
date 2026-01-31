"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { buildAuthModalUrl } from "@/lib/authModalUrl";
import { useScrollLock } from "@/hooks/ui/useScrollLock";
import { PreSupportModal } from "./PreSupportModal";
import { PreSupportContent } from "./one-time/PreSupportContent";
import { SupportHeader } from "./one-time/SupportHeader";
import { SupportDalinkCard } from "./one-time/SupportDalinkCard";
import { AmountButtons } from "./one-time/AmountButtons";
import { CustomAmountInput } from "./one-time/CustomAmountInput";
import { SupportSocialPrompt } from "./one-time/SupportSocialPrompt";
import type { PreSupportProfile } from "./one-time/types";

interface OneTimeSupportProps {
  customAmount: string;
  onAmountChange: (amount: string) => void;
  showSocialPrompt?: boolean;
}

const predefinedAmounts = [100, 300, 500, 1000, 2000, 5000];

export default function OneTimeSupport({
  customAmount,
  onAmountChange,
  showSocialPrompt,
}: OneTimeSupportProps) {
  const amountNumber = parseInt(customAmount || "0", 10);
  const hasAmount = !!amountNumber && amountNumber > 0;
  const [isPreSupportOpen, setIsPreSupportOpen] = useState(false);
  const [profile, setProfile] = useState<PreSupportProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dalinkUrl = "https://dalink.to/kopilkaonline";
  const suggestedTag = useMemo(
    () => (profile?.username ? `@${profile.username}` : "@username"),
    [profile?.username],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useScrollLock(isPreSupportOpen);

  useEffect(() => {
    if (!isPreSupportOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsPreSupportOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isPreSupportOpen]);

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

  const authUrl = buildAuthModalUrl({
    pathname: "/support",
    search: typeof window !== "undefined" ? window.location.search : "",
    modal: "auth/signup",
  });

  function renderPreSupportModal() {
    return (
      <PreSupportModal onClose={closePreSupport}>
        <PreSupportContent
          profile={profile}
          suggestedTag={suggestedTag}
          dalinkUrl={dalinkUrl}
          authUrl={authUrl}
          onClose={closePreSupport}
          onCopy={copyText}
        />
      </PreSupportModal>
    );
  }

  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <SupportHeader />

        <div className="bg-[#004643]/20 backdrop-blur-sm border border-[#abd1c6]/15 rounded-xl sm:rounded-2xl p-5 sm:p-6">
          <h3
            className="text-lg sm:text-xl font-semibold mb-5 sm:mb-6 text-center"
            style={{ color: "#abd1c6" }}
          >
            Выберите сумму поддержки
          </h3>

          <SupportDalinkCard
            dalinkUrl={dalinkUrl}
            hasAmount={hasAmount}
            amountNumber={amountNumber}
            onOpenPreSupport={() => {
              setIsPreSupportOpen(true);
              ensureProfileLoaded();
            }}
          />

          {/* Pre-support modal */}
          {mounted && isPreSupportOpen
            ? createPortal(renderPreSupportModal(), document.body)
            : null}

          <AmountButtons
            amounts={predefinedAmounts}
            selectedAmount={customAmount}
            onAmountChange={onAmountChange}
          />

          <CustomAmountInput value={customAmount} onChange={onAmountChange} />

          {showSocialPrompt && <SupportSocialPrompt />}
        </div>
      </div>
    </section>
  );
}
