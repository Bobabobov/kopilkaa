"use client";

import ProgressBar from "@/components/applications/ProgressBar";
import MotivationalMessages from "@/components/applications/MotivationalMessages";
import { motion } from "framer-motion";

type Props = {
  title: string;
  summary: string;
  story: string;
  amount: string;
  payment: string;
  photos: any[];
  progressPercentage: number;
  filledFields: number;
  totalFields: number;
};

export function ApplicationsProgress({
  title,
  summary,
  story,
  amount,
  payment,
  photos,
  progressPercentage,
  filledFields,
  totalFields,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <ProgressBar
        title={title}
        summary={summary}
        story={story}
        amount={amount}
        payment={payment}
        photos={photos}
      />

      <MotivationalMessages
        progress={progressPercentage}
        filledFields={filledFields}
        totalFields={totalFields}
      />
    </motion.div>
  );
}

export default ApplicationsProgress;
