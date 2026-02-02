"use client";

import { useState } from "react";
import { LucideIcons } from "@/components/ui/LucideIcons";

interface ShareStoryButtonProps {
  storyId: string;
  title?: string;
}

export function ShareStoryButton({ storyId, title }: ShareStoryButtonProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/stories/${storyId}`
      : "";

  const handleClick = async () => {
    const url = getUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-xl border border-[#abd1c6]/30 bg-[#001e1d]/40 px-4 py-2.5 text-sm font-semibold text-[#abd1c6] transition-all duration-300 hover:border-[#f9bc60]/50 hover:text-[#f9bc60] hover:bg-[#f9bc60]/10"
      title="Поделиться"
    >
      {copied ? (
        <>
          <LucideIcons.Check size="sm" className="text-[#abd1c6]" />
          <span>Ссылка скопирована</span>
        </>
      ) : (
        <>
          <LucideIcons.Share size="sm" />
          <span>Поделиться</span>
        </>
      )}
    </button>
  );
}
