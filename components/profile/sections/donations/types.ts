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
