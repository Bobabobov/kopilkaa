"use client";

import { ApplicationApplicantStrip } from "@/components/applications/ApplicationApplicantStrip";
import { ApplicationEconomyRules } from "@/components/applications/ApplicationEconomyRules";
import type { ApplicationEligibility } from "@/lib/applications/applicationEconomy";
import { cn } from "@/lib/utils";

type Props = {
  displayName: string;
  avatarUrl?: string | null;
  eligibility: ApplicationEligibility | null;
  loadingEligibility?: boolean;
  showEconomyRules?: boolean;
  /** Компактный аватар на мобильном, крупнее в десктоп-сайдбаре */
  size?: "sm" | "md";
  className?: string;
};

export function ApplicationFormAsideIntro({
  displayName,
  avatarUrl,
  eligibility,
  loadingEligibility = false,
  showEconomyRules = true,
  size = "md",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        size === "sm" &&
          "rounded-2xl border border-white/[0.08] bg-white/[0.03]",
        className,
      )}
    >
      <div
        className={cn(
          "border-b border-white/10",
          size === "sm" ? "px-3 py-2.5 sm:px-4" : "px-8 pb-5 pt-8 xl:px-10 xl:pt-10",
        )}
      >
        <ApplicationApplicantStrip
          displayName={displayName}
          avatarUrl={avatarUrl}
          size={size}
        />
      </div>

      {showEconomyRules && (
        <div
          className={cn(
            size === "sm" ? "p-3 sm:p-4" : "px-8 pt-6 pb-2 xl:px-10",
          )}
        >
          <ApplicationEconomyRules
            eligibility={eligibility}
            loading={loadingEligibility}
            variant="embedded"
          />
        </div>
      )}
    </div>
  );
}
