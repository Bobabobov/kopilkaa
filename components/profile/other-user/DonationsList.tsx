import { DonationItem } from "./DonationItem";
import type { Donation } from "./hooks/useOtherUserDonations";

interface DonationsListProps {
  donations: Donation[];
  maxItems?: number;
}

export function DonationsList({ donations, maxItems = 3 }: DonationsListProps) {
  if (donations.length === 0) return null;

  return (
    <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
      {donations.slice(0, maxItems).map((donation, index) => (
        <DonationItem key={donation.id} donation={donation} index={index} />
      ))}
    </div>
  );
}
