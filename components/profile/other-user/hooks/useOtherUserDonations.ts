import { useState, useEffect } from "react";

export interface Donation {
  id: string;
  amount: number;
  comment?: string | null;
  createdAt: string;
}

export interface DonationsStats {
  totalDonated: number;
  donationsCount: number;
  recentDonated: number;
  recentCount: number;
}

export interface DonationsData {
  donations: Donation[];
  stats: DonationsStats;
}

export function useOtherUserDonations(userId: string) {
  const [data, setData] = useState<DonationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch(`/api/users/${userId}/donations`, {
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
  }, [userId]);

  return { data, loading, error };
}
