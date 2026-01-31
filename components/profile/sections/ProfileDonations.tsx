"use client";

import { useState, useEffect } from "react";
import { ProfileDonationsLoading } from "./donations/ProfileDonationsLoading";
import { ProfileDonationsError } from "./donations/ProfileDonationsError";
import { ProfileDonationsEmpty } from "./donations/ProfileDonationsEmpty";
import { ProfileDonationsHeader } from "./donations/ProfileDonationsHeader";
import { ProfileDonationsStats } from "./donations/ProfileDonationsStats";
import { ProfileDonationsList } from "./donations/ProfileDonationsList";
import type { DonationsData } from "./donations/types";

export default function ProfileDonations() {
  const [data, setData] = useState<DonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("/api/profile/donations", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching donations:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load donations",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) {
    return <ProfileDonationsLoading />;
  }

  if (error) {
    return <ProfileDonationsError error={error} />;
  }

  if (!data || data.stats.donationsCount === 0) {
    return <ProfileDonationsEmpty />;
  }

  return (
    <div className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden">
      <ProfileDonationsHeader
        totalDonated={data.stats.totalDonated}
        donationsCount={data.stats.donationsCount}
      />

      <ProfileDonationsStats
        totalDonated={data.stats.totalDonated}
        donationsCount={data.stats.donationsCount}
      />

      <ProfileDonationsList donations={data.donations} />
    </div>
  );
}
