"use client";

import { motion } from "framer-motion";
import { useOtherUserDonations } from "./hooks/useOtherUserDonations";
import { DonationsLoading } from "./DonationsLoading";
import { DonationsError } from "./DonationsError";
import { DonationsEmpty } from "./DonationsEmpty";
import { DonationsHeader } from "./DonationsHeader";
import { DonationsStats } from "./DonationsStats";
import { DonationsList } from "./DonationsList";

interface OtherUserDonationsProps {
  userId: string;
}

export default function OtherUserDonations({
  userId,
}: OtherUserDonationsProps) {
  const { data, loading, error } = useOtherUserDonations(userId);

  if (loading) {
    return <DonationsLoading />;
  }

  if (error) {
    return <DonationsError error={error} />;
  }

  if (!data || data.stats.donationsCount === 0) {
    return <DonationsEmpty />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#004643]/60 backdrop-blur-sm rounded-xl border border-[#abd1c6]/20 overflow-hidden"
    >
      <DonationsHeader stats={data.stats} />
      <DonationsStats stats={data.stats} />
      <DonationsList donations={data.donations} />
    </motion.div>
  );
}
